// src/car_short_videos/services/car-short-video.service.ts
import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere, In, MoreThan } from 'typeorm'

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
    async findAll(): Promise<CarShortVideoEntity[]> {
        return this.videoRepo.find({
            where: { moderated: true },
            relations: { brand: true, model: true },
            order: { createdAt: 'DESC' },
        })
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

    /** По бренду */
    async findByBrand(brandId: number): Promise<CarShortVideoEntity[]> {
        return this.videoRepo.find({
            where: {
                moderated: true,
                brand: { id: brandId },
            },
            relations: { brand: true, model: true },
            order: { createdAt: 'DESC' },
        })
    }

    /** По бренду и модели */
    async findByBrandAndModel(
        brandId: number,
        modelId: number,
    ): Promise<CarShortVideoEntity[]> {
        return this.videoRepo.find({
            where: {
                moderated: true,
                brand: { id: brandId },
                model: { id: modelId },
            },
            relations: { brand: true, model: true },
            order: { createdAt: 'DESC' },
        })
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
