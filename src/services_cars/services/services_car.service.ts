import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
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
import { ForbiddenException } from '@nestjs/common'
import { User } from 'src/users/entities/user.entity';
import { CarServiceFiltersDto } from '../dto/car-service-filters.dto';

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
        user: any
    ): Promise<CarServiceEntity> {
        const city = await this.cityRepo.findOne({ where: { id: dto.cityId } })
        if (!city) {
            throw new Error('Invalid city ID')
        }

        const brands = await this.brandRepo.find({
            where: { id: In(dto.brandIds) },
        })
        if (!brands.length) {
            throw new Error('Invalid brand IDs')
        }

        const masterTypes = await this.masterRepo.find({
            where: { id: In(dto.masterTypeIds) },
        })
        if (!masterTypes.length) {
            throw new Error('Invalid master type IDs')
        }

        const avatarUrl = avatarFile ? `/uploads/car-services/${avatarFile.filename}` : null

        const photoUrls = Array.isArray(photoFiles)
            ? photoFiles.map((file) => `/uploads/car-services/${file.filename}`)
            : []

        const service = this.repo.create({
            ...dto,
            city,
            brands,
            masterTypes,
            avatar: avatarUrl,
            photos: photoUrls,
            moderated: false,
            createdBy: user.id,
            videoLink: null, // ← пока пусто, обновится позже
        })

        return this.repo.save(service)
    }
    async uploadVideoToS3(serviceId: number, videoFile: Express.Multer.File) {
        const videoUrl = await this.storageService.uploadVideo(videoFile)


        await this.repo.update(serviceId, { videoLink: videoUrl, moderated: false, })

        return { success: true, url: videoUrl }
    }

    async isCreatedByUser(serviceId: number, user: any): Promise<boolean> {
        const service = await this.repo.findOne({
            where: { id: serviceId },
            relations: ['createdBy'],
        })

        if (!service) {
            throw new BadRequestException('Service not found')
        }
        console.log(service, 'service user')

        return service.createdBy.id === user.id
    }



    async update(
        id: number,
        dto: CreateCarServiceDto,
        user: User,
        avatarFile?: Express.Multer.File,
        photoFiles?: Express.Multer.File[],
        videoFile?: Express.Multer.File,
    ): Promise<CarServiceEntity> {
        const service = await this.repo.findOne({
            where: { id },
            relations: ['createdBy'],
        });

        if (!service) {
            throw new BadRequestException('Car service not found');
        }

        // 🔥 Проверяем право редактирования
        if (service.createdBy.id !== user.id) {
            throw new ForbiddenException('You are not allowed to edit this service');
        }

        // ✅ Сохраняем новые файлы если есть
        let avatarUrl = service.avatar;
        if (avatarFile) {
            avatarUrl = `/uploads/car-services/${avatarFile.filename}`;
        }

        let photoUrls = service.photos || [];
        if (photoFiles && photoFiles.length) {
            photoUrls = photoFiles.map((file) => `/uploads/car-services/${file.filename}`);
        }

        let videoUrl = service.videoLink;
        if (videoFile) {
            videoUrl = await this.storageService.uploadVideo(videoFile);
        }

        // ✅ Обновляем поля
        Object.assign(service, {
            ...dto,
            avatar: avatarUrl,
            photos: photoUrls,
            videoLink: videoUrl,
            moderated: false,
        });

        return this.repo.save(service);
    }
    async findOne(id: number) {
        const service = await this.repo.findOne({
            where: { id },
            relations: ['city', 'brands', 'masterTypes'], // добавь нужные связи
        })

        if (!service) {
            throw new ForbiddenException(`Service with id ${id} not found`)
        }

        return service
    }
    async moderateService(id: number, user: any): Promise<CarServiceEntity> {
        if (user.role !== 'ADMIN') {
            throw new ForbiddenException('Access denied')
        }

        const service = await this.repo.findOne({ where: { id } })
        if (!service) {
            throw new NotFoundException('Service not found')
        }

        service.moderated = true
        return this.repo.save(service)
    }
    async findAllNoModerated(user: any) {
        if (user && user.role !== 'ADMIN' || !user) {
            throw new ForbiddenException('Access denied')
        }
        const query = this.repo.createQueryBuilder('service')
            .where('service.moderated = :moderated', { moderated: false })

        return query.getMany()
    }

    async findAll(filters: CarServiceFiltersDto) {
        const query = this.repo.createQueryBuilder('service')
            .leftJoinAndSelect('service.city', 'city')
            .leftJoinAndSelect('service.brands', 'brand')
            .leftJoinAndSelect('service.masterTypes', 'masterType')
            .leftJoinAndSelect('service.createdBy', 'createdBy')
            .where('service.moderated = :moderated', { moderated: true })

        if (filters.cityId) {
            query.andWhere('city.id = :cityId', { cityId: filters.cityId })
        }



        if (filters.brandIds && filters.brandIds.length > 0) {
            query.andWhere('brand.id IN (:...brandIds)', { brandIds: filters.brandIds })
        }

        console.log(filters, 'filters')

        if (filters.masterTypeIds && filters.masterTypeIds.length > 0) {
            query.andWhere('masterType.id IN (:...masterTypeIds)', { masterTypeIds: filters.masterTypeIds })
        }

        return query.getMany()
    }
}