import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CarBrand } from '../../auto_brand/entities/car-brand.entity';
import { CarModel } from '../../auto_model/entities/auto-model.entity';
import { CountryModel } from '../../country/entities/country.entity';
import { MasterModel } from '../../master_type/entities/master_type.entity';
import { CarServiceEntity } from '../entities/service_cars.entity'
import { CreateCarServiceDto } from '../dto/create-service-car.dto'
import { In } from 'typeorm'
import { StorageService } from '../../shared/storage/s3.service'
import { StorageModule } from '../../shared/storage/storage.module'

@Injectable()
export class CarServiceService {
    constructor(
        @InjectRepository(CarServiceEntity)
        private readonly repo: Repository<CarServiceEntity>,
        @InjectRepository(CountryModel)
        private readonly cityRepo: Repository<CountryModel>,
        @InjectRepository(CarBrand)
        private readonly brandRepo: Repository<CarBrand>,
        @InjectRepository(CarModel)
        private readonly modelRepo: Repository<CarModel>,
        @InjectRepository(MasterModel)
        private readonly masterRepo: Repository<MasterModel>,
        private readonly storageService: StorageService,
    ) { }

    async create(
        dto: CreateCarServiceDto,
        avatarFile: Express.Multer.File,
        photoFiles: Express.Multer.File[],
        videoFile?: Express.Multer.File,
    ): Promise<CarServiceEntity> {
        const city = await this.cityRepo.findOne({
            where: { id: dto.cityId },
        })
        if (!city) {
            throw new Error('Invalid city ID')
        }

        const brands = await this.brandRepo.find({
            where: { id: In(dto.brandIds) },
        })
        if (!brands.length) {
            throw new Error('Invalid brand IDs')
        }

        const models = await this.modelRepo.find({
            where: { id: In(dto.modelIds) },
        })
        if (!models.length) {
            throw new Error('Invalid model IDs')
        }

        const masterTypes = await this.masterRepo.find({
            where: { id: In(dto.masterTypeIds) },
        })
        if (!masterTypes.length) {
            throw new Error('Invalid master type IDs')
        }

        // ✅ Сохраняем аватар
        const avatarUrl = avatarFile ? `/uploads/car-services/${avatarFile.filename}` : null
        // ✅ Сохраняем фото
        const photoUrls = Array.isArray(photoFiles)
            ? photoFiles.map((file) => `/uploads/car-services/${file.filename}`)
            : []

        // ✅ Сохраняем видео
        let videoUrl: string | null = null
        if (videoFile) {
            // тут должна быть загрузка в облачное хранилище
            // например:
            videoUrl = await this.storageService.uploadVideo(videoFile)
        }

        const service = this.repo.create({
            ...dto,
            city,
            brands,
            models,
            masterTypes,
            avatar: avatarUrl,
            photos: photoUrls,
            videoLink: videoUrl,
        })

        return this.repo.save(service)
    }

    async findAll(): Promise<CarServiceEntity[]> {
        return this.repo.find({
            relations: ['city', 'brands', 'models', 'masterTypes'],
        })
    }
}