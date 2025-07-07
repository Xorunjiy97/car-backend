import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarIternal } from '../entities/index';
import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities';
import { CarModelIternar } from 'src/auto_model_iternal/entities';
import { EngineModel } from 'src/engine_type/entities/engine.entity';
import { CountryModel } from 'src/country/entities/country.entity';
import { BodyModel } from 'src/body_type/entities/body.entity';
import { GearModel } from 'src/gear_box/entities/gear.entity';
import { TechnologyAutoModel } from 'src/technology_avto/entities';
import { CityModel } from 'src/city/entities';
import { CreateCarDto } from '../dto/create-car.dto';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CountryManufacturerModel } from 'src/country_manufacturer/entities'
import { StorageService } from '../../shared/storage/s3.service'

import * as fs from 'fs';
import * as path from 'path';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { GetCarListDto } from '../dto/get-car-list.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarIternal) private readonly carRepository: Repository<CarIternal>,
    @InjectRepository(CarBrandIternal)
    private readonly brandRepository: Repository<CarBrandIternal>,
    @InjectRepository(CarModelIternar)
    private readonly modelRepository: Repository<CarModelIternar>,
    @InjectRepository(CountryManufacturerModel)
    private readonly countryRepository: Repository<CountryManufacturerModel>,
    @InjectRepository(EngineModel)
    private readonly engineRepository: Repository<EngineModel>,
    @InjectRepository(BodyModel)
    private readonly bodyRepository: Repository<BodyModel>,
    @InjectRepository(GearModel)
    private readonly gearRepository: Repository<GearModel>,
    @InjectRepository(GearModel)
    private readonly cityRepository: Repository<CityModel>,
    @InjectRepository(TechnologyAutoModel)
    private readonly technologyRepository: Repository<TechnologyAutoModel>,
    private readonly storageService: StorageService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // cityRepository
  ) { }

  async findAll(filters: GetCarListDto): Promise<Pagination<CarIternal>> {
    const { page, limit } = filters
    console.log(filters, 'filters')

    const query = this.carRepository.createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.country', 'country')
      .leftJoinAndSelect('car.engine_type', 'engine')
      .leftJoinAndSelect('car.body_type', 'body')
      .leftJoinAndSelect('car.gear_box', 'gear')
      .where('car.moderated = :moderated', { moderated: true })

    if (filters.brandId) query.andWhere('car.brand = :brandId', { brandId: filters.brandId })

    if (filters.countryId?.length) {
      query.andWhere('car.country IN (:...countryIds)', { countryIds: filters.countryId });
    }
    if (filters.engineTypeId?.length) {
      query.andWhere('car.engine_type IN (:...engineTypeIds)', { engineTypeIds: filters.engineTypeId });
    }
    if (filters.bodyTypeId?.length) {
      query.andWhere('car.body_type IN (:...bodyTypeIds)', { bodyTypeIds: filters.bodyTypeId });
    }
    if (filters.gearBoxId?.length) {
      query.andWhere('car.gear_box IN (:...gearBoxIds)', { gearBoxIds: filters.gearBoxId });
    }


    if (filters.priceFromMin) query.andWhere('car.priceFrom >= :priceFromMin', { priceFromMin: filters.priceFromMin })
    if (filters.priceFromMax) query.andWhere('car.priceFrom <= :priceFromMax', { priceFromMax: filters.priceFromMax })

    if (filters.mileageMin) query.andWhere('car.mileage >= :mileageMin', { mileageMin: filters.mileageMin })
    if (filters.mileageMax) query.andWhere('car.mileage <= :mileageMax', { mileageMax: filters.mileageMax })

    if (filters.yearMin) query.andWhere('car.year >= :yearMin', { yearMin: filters.yearMin })
    if (filters.yearMax) query.andWhere('car.year <= :yearMax', { yearMax: filters.yearMax })

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    }
  }
  async findAllNoModerated(user: any) {
    if (user && user.role !== 'ADMIN' || !user) {
      throw new ForbiddenException('Access denied')
    }
    const query = this.carRepository.createQueryBuilder('service')
      .where('service.moderated = :moderated', { moderated: false })

    return query.getMany()
  }
  async uploadVideoToS3(serviceId: number, videoFile: Express.Multer.File) {
    const videoUrl = await this.storageService.uploadCarVideo(videoFile)


    await this.carRepository.update(serviceId, { videoLink: videoUrl, moderated: false, })

    return { success: true, url: videoUrl }
  }

  async findOne(id: number): Promise<CarIternal> {
    return this.carRepository.findOne({
      where: { id },
      relations: [
        'brand',
        'model',
        'country',
        'engine_type',
        'body_type',
        'gear_box',
      ],
    });
  }


  async remove(id: number): Promise<{ message: string }> {
    const car = await this.carRepository.findOne({ where: { id } });

    if (!car) {
      throw new Error('Car not found');
    }

    // ✅ Удалим связанные фотографии (локально, если есть)
    const allPhotoPaths = [...(car.photos || []), car.avatar].filter(Boolean);

    for (const photoPath of allPhotoPaths) {
      const fileName = photoPath.split('/').pop();
      const fullPath = path.join(__dirname, '../../../uploads/cars', fileName);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await this.carRepository.remove(car);

    return { message: `Автомобиль с ID ${id} удалён` };
  }
  async isCreatedByUser(carId: number, user: any): Promise<boolean> {
    const service = await this.carRepository.findOne({
      where: { id: carId },
      relations: ['createdBy'],
    })

    if (!service) {
      throw new BadRequestException('Service not found')
    }

    return service.createdBy.id === user.id
  }
  private raiseFieldError(field: string, message: string): never {
    throw new BadRequestException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [{ field, message }],
      },
      'ValidationError',
    )
  }

  async moderateService(id: number, user: any): Promise<CarIternal> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Access denied')
    }

    const service = await this.carRepository.findOne({ where: { id } })
    if (!service) {
      throw new NotFoundException('Service not found')
    }

    service.moderated = true
    return this.carRepository.save(service)
  }

  async create(
    dto: CreateCarDto,
    avatarFile: Express.Multer.File | undefined,
    files: Express.Multer.File[] | undefined,
    user: any
  ): Promise<CarIternal> {
    /* ---------- валидируем справочники параллельно ---------- */
    const [
      model,
      brand,
      country,
      city,
      engine,
      body,
      gear,
      technology,
    ] = await Promise.all([
      this.modelRepository.findOne({ where: { id: dto.modelId } }),
      this.brandRepository.findOne({ where: { id: dto.brandId } }),
      this.countryRepository.findOne({ where: { id: dto.countryId } }),
      this.cityRepository.findOne({ where: { id: dto.cityId } }),
      this.engineRepository.findOne({ where: { id: dto.engineTypeId } }),
      this.bodyRepository.findOne({ where: { id: dto.bodyTypeId } }),
      this.gearRepository.findOne({ where: { id: dto.gearBoxId } }),
      this.technologyRepository.findOne({ where: { id: dto.technologyId } }),
    ])

    /* --- если чего-то нет, кидаем 400 --- */
    if (!model) this.raiseFieldError('modelId', 'Модель не найдена')
    if (!brand) this.raiseFieldError('brandId', 'Бренд не найден')
    if (!country) this.raiseFieldError('countryId', 'Страна не найдена')
    if (!city) this.raiseFieldError('cityId', 'Город не найден')
    if (!engine) this.raiseFieldError('engineTypeId', 'Двигатель не найден')
    if (!body) this.raiseFieldError('bodyTypeId', 'Кузов не найден')
    if (!gear) this.raiseFieldError('gearBoxId', 'КПП не найдена')
    if (!technology) this.raiseFieldError('technologyId', 'Технология не найдена')

    /* ---------- медиа ---------- */
    const avatarUrl = avatarFile ? `/uploads/cars/${avatarFile.filename}` : null
    const photoUrls = Array.isArray(files)
      ? files.map(f => `/uploads/cars/${f.filename}`)
      : []

    /* ---------- создаём сущность ---------- */
    const car = this.carRepository.create({
      /* scalar */
      hpCount: dto.hp_count,
      numberOfSeats: dto.number_of_seats,
      color: dto.color,
      vinCode: dto.vin_code,
      enginePower: dto.engine_power,
      mileage: dto.mileage,
      year: dto.year,
      price: dto.price,
      creditPosible: dto.credit_posible,
      barterPosible: dto.barter_posible,
      crashed: dto.crashed,
      collored: dto.collored,
      needsRenovation: dto.needs_renovation,
      userName: dto.user_name,
      userEmail: dto.user_email,
      userPhone: dto.user_phone,
      description: dto.description,
      moderated: dto.moderated,

      /* relations */
      brand,
      model,
      country,
      city,
      engineType: engine,
      bodyType: body,
      gearBox: gear,
      technology,

      /* media */
      avatar: avatarUrl,
      photos: photoUrls,
      videoLink: dto.videoLink,

      createdBy: user,            // ENTIRE User entity
    })

    /* ---------- кэш ---------- */
    await this.cacheManager.del('cars_all')

    return this.carRepository.save(car)
  }

}
