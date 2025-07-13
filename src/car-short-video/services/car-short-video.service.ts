// src/car_short_videos/services/car-short-video.service.ts
import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere, In, MoreThan, SelectQueryBuilder } from 'typeorm'

import { CarShortVideoEntity } from '../entities/car-short-video.entity'
import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities'
import { CarModelIternar } from 'src/auto_model_iternal/entities'
import { StorageService } from 'src/shared/storage/s3.service'
import { CreateCarShortVideoDto } from '../dto/create-car-short-video.dto'
import { User } from 'src/users/entities/user.entity';
import { CarShortVideoLikeEntity } from '../entities/car-short-likes-video.entity'

interface Paginated<T> {
    items: T[]
    total: number
    page: number
    limit: number
    pages: number
}
interface UserSub {
    sub: number,
    role: string
}

@Injectable()
export class CarShortVideoService {
    constructor(
        @InjectRepository(CarShortVideoEntity)
        private readonly videoRepo: Repository<CarShortVideoEntity>,

        @InjectRepository(CarBrandIternal)
        private readonly brandRepo: Repository<CarBrandIternal>,

        @InjectRepository(CarModelIternar)
        private readonly modelRepo: Repository<CarModelIternar>,

        private readonly storageService: StorageService,

        @InjectRepository(CarShortVideoLikeEntity)
        private readonly likeRepo: Repository<CarShortVideoLikeEntity>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    private baseQuery(currentUser?: UserSub) {
        const qb = this.videoRepo
            .createQueryBuilder('video')
            .leftJoinAndSelect('video.brand', 'brand')
            .leftJoinAndSelect('video.model', 'model')
            .where('video.moderated = true')
            .orderBy('video.createdAt', 'DESC')

        /* счётчик лайков */
        qb.loadRelationCountAndMap('video.likesCount', 'video.likes')

        /* флаг isLiked (0 / 1 → boolean) */
        if (currentUser) {
            qb.loadRelationCountAndMap(
                'video._isLikedTmp',
                'video.likes',
                'my_like',
                (sub) =>
                    sub.where('my_like.user_id = :uid', { uid: currentUser.sub }),
            )
        }

        return qb
    }

    /* ---------- конвертация сырых 0/1 в boolean ---------- */
    private async mapIsLiked(qb: SelectQueryBuilder<CarShortVideoEntity>, currentUser?: UserSub) {
        const videos = await qb.getMany()

        if (currentUser) {
            videos.forEach((v: any) => {
                v.isLiked = !!v._isLikedTmp
                delete v._isLikedTmp
            })
        }
        return videos
    }

    /* ------------------------------------------------------------------ */
    /*  CREATE                                                           */
    /* ------------------------------------------------------------------ */
    async create(
        dto: CreateCarShortVideoDto,
        file: Express.Multer.File,
        currentUser: UserSub,
    ): Promise<CarShortVideoEntity> {

        /* --- проверяем, есть ли у автора НЕмодерированные видео --- */
        const hasUnmoderated = await this.videoRepo.findOne({
            where: {
                createdBy: { id: +currentUser.sub },   // автор
                moderated: false,                      // ещё не проверено админом
            },
            select: { id: true },                    // нам нужен только факт
        })

        if (hasUnmoderated) {
            throw new ForbiddenException(
                'У вас уже есть видео на модерации. Подождите, пока администратор его одобрит.',
            )
        }

        /* --- грузим файл, создаём новую запись --- */
        const [brand, model] = await Promise.all([
            this.brandRepo.findOneByOrFail({ id: dto.brandId }),
            this.modelRepo.findOneByOrFail({ id: dto.modelId }),
        ])

        const videoUrl = await this.storageService.uploadShortCarVideo(file)

        const video = this.videoRepo.create({
            brand,
            model,
            description: dto.description,
            videoUrl,
            createdBy: { id: +currentUser.sub },
            phone: dto.phone,
            // moderated остаётся false по умолчанию
        })

        return this.videoRepo.save(video)
    }



    /* ------------------------------------------------------------------ */
    /*  READ                                                             */
    /* ------------------------------------------------------------------ */

    /** Публичный список (только модерированные) */
    async findAll(currentUser?: UserSub) {
        return this.mapIsLiked(this.baseQuery(currentUser), currentUser)
    }
    /** Немодерированные – только для ADMIN */
    async findAllNoModerated(user: any): Promise<CarShortVideoEntity[]> {
        if (!user || user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied')
        }

        return this.videoRepo.find({
            where: { moderated: false },
            relations: { brand: true, model: true },
            order: { createdAt: 'DESC' },
        })
    }

    /** Пагинированный поиск (если понадобится) */
    private async paginate(
        where: FindOptionsWhere<CarShortVideoEntity>,
        page: number,
        limit: number,
    ): Promise<Paginated<CarShortVideoEntity>> {
        const [items, total] = await this.videoRepo.findAndCount({
            where,
            relations: { brand: true, model: true },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        })

        return {
            items,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
        }
    }

    async findByBrand(brandId: number, currentUser?: UserSub) {
        const qb = this.baseQuery(currentUser).andWhere('brand.id = :brandId', { brandId })
        return this.mapIsLiked(qb, currentUser)
    }

    /* ---------- по бренду и модели ---------- */
    async findByBrandAndModel(brandId: number, modelId: number, currentUser?: UserSub) {
        const qb = this.baseQuery(currentUser)
            .andWhere('brand.id = :brandId', { brandId })
            .andWhere('model.id = :modelId', { modelId })
        return this.mapIsLiked(qb, currentUser)
    }

    /* ------------------------------------------------------------------ */
    /*  UPDATE (модерация)                                               */
    /* ------------------------------------------------------------------ */
    async moderateVideo(id: number, user: any): Promise<CarShortVideoEntity> {
        if (user.role !== 'ADMIN') throw new ForbiddenException('Access denied')

        const video = await this.videoRepo.findOne({
            where: { id },
            relations: { brand: true, model: true },
        })
        if (!video) throw new NotFoundException('Video not found')

        video.moderated = true
        return this.videoRepo.save(video)
    }

    async toggleLike(videoId: number, user: any) {
        const existing = await this.likeRepo.findOne({
            where: { video: { id: videoId }, user: { id: user.sub } },
        })

        if (existing) {
            await this.likeRepo.remove(existing) // анлайк
            return { liked: false }
        }

        await this.likeRepo.save(
            this.likeRepo.create({
                video: { id: videoId } as any,
                user: { id: user.sub } as any,
            }),
        )
        return { liked: true }
    }
}
