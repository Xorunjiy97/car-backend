import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsWhere, Repository } from 'typeorm'
import { StorageService } from '../../shared/storage/s3.service'
import { CarShortVideoEntity } from '../entities/car-short-video.entity'
import { CreateCarShortVideoDto } from '../dto/create-car-short-video.dto'
interface Paginated<T> {
    items: T[]
    total: number
    page: number
    limit: number
    pages: number
}
@Injectable()
export class CarShortVideoService {
    constructor(
        @InjectRepository(CarShortVideoEntity)
        private readonly videoRepo: Repository<CarShortVideoEntity>,
        private readonly storageService: StorageService,
    ) { }

    async create(
        dto: CreateCarShortVideoDto,
        file: Express.Multer.File,
    ): Promise<CarShortVideoEntity> {
        const videoUrl = await this.storageService.uploadShortCarVideo(file)

        const video = this.videoRepo.create({
            brand: dto.brand,
            model: dto.model,
            description: dto.description,
            videoUrl,
        })

        return this.videoRepo.save(video)
    }

    async findAll() {
        return this.videoRepo.find({ order: { createdAt: 'DESC' } })
    }
    private async paginate(
        where: FindOptionsWhere<CarShortVideoEntity>,
        page: number,
        limit: number,
    ): Promise<Paginated<CarShortVideoEntity>> {
        const [items, total] = await this.videoRepo.findAndCount({
            where,
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

    async findByBrand(brand: string) {
        return this.videoRepo.find({
            where: { brand },
            order: { createdAt: 'DESC' },
        })
    }

    async findByBrandAndModel(brand: string, model: string) {
        return this.videoRepo.find({
            where: { brand, model },
            order: { createdAt: 'DESC' },
        })
    }
}
