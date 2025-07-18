import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
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
import { CarLikeEntity } from '../entities/car-like.entity';

interface UserSub {
  sub: number,
  role: string
}


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
    @InjectRepository(CarLikeEntity)
    private readonly likeRepo: Repository<CarLikeEntity>,
    @InjectRepository(TechnologyAutoModel)
    private readonly technologyRepository: Repository<TechnologyAutoModel>,
    private readonly storageService: StorageService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // cityRepository
  ) { }
  private buildListQuery(
    filters: GetCarListDto,
    currentUser?: UserSub,
    withCounts = true,          // 👈 новый флаг
  ) {
    const qb = this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.country', 'country')
      .leftJoinAndSelect('car.engineType', 'engine')
      .leftJoinAndSelect('car.bodyType', 'body')
      .leftJoinAndSelect('car.gearBox', 'gear')
      .leftJoinAndSelect('car.technologies', 'tech')
      .leftJoinAndSelect('car.city', 'city') // если нужно
      .where('car.moderated = :moderated', { moderated: true })

    /* ... фильтры ... */
    if (filters.brandId)
      qb.andWhere('brand.id = :brandId', { brandId: filters.brandId })

    if (filters.countryId?.length)
      qb.andWhere('country.id IN (:...countryIds)', {
        countryIds: filters.countryId,
      })

    if (filters.engineTypeId?.length)
      qb.andWhere('engine.id IN (:...engineTypeIds)', {
        engineTypeIds: filters.engineTypeId,
      })

    if (filters.bodyTypeId?.length)
      qb.andWhere('body.id IN (:...bodyTypeIds)', {
        bodyTypeIds: filters.bodyTypeId,
      })

    if (filters.gearBoxId?.length)
      qb.andWhere('gear.id IN (:...gearBoxIds)', {
        gearBoxIds: filters.gearBoxId,
      })

    /* ---------- фильтры-диапазоны ---------- */
    if (filters.priceFromMin)
      qb.andWhere('car.price >= :priceFromMin', {
        priceFromMin: filters.priceFromMin,
      })
    if (filters.priceFromMax)
      qb.andWhere('car.price <= :priceFromMax', {
        priceFromMax: filters.priceFromMax,
      })

    if (filters.mileageMin)
      qb.andWhere('car.mileage >= :mileageMin', {
        mileageMin: filters.mileageMin,
      })
    if (filters.mileageMax)
      qb.andWhere('car.mileage <= :mileageMax', {
        mileageMax: filters.mileageMax,
      })

    if (filters.yearMin)
      qb.andWhere('car.year >= :yearMin', { yearMin: filters.yearMin })
    if (filters.yearMax)
      qb.andWhere('car.year <= :yearMax', { yearMax: filters.yearMax })

    /* --- лайки и isLiked --- */
    if (withCounts) {
      qb.loadRelationCountAndMap('car.likesCount', 'car.likes')

      console.log(currentUser, 'currentUser')

      if (currentUser) {
        qb.loadRelationCountAndMap(
          'car._isLikedTmp',
          'car.likes',
          'my_like',
          sub => sub.where('my_like.user_id = :uid', { uid: currentUser.sub }),
        )
      }
    }

    return qb
  }

  /* ------------------------------------------------------------------ */
  /* 2. helper: превращаем _isLikedTmp → isLiked:boolean                */
  /* ------------------------------------------------------------------ */
  private async mapIsLiked(
    qb: SelectQueryBuilder<CarIternal>,
    currentUser?: UserSub,
  ) {
    const items = await qb.getMany()
    if (currentUser) {
      items.forEach((c: any) => {
        c.isLiked = !!c._isLikedTmp
        delete c._isLikedTmp
      })
    }
    return items
  }

  /* ------------------------------------------------------------------ */
  /* 3. основной метод list + пагинация                                 */
  /* ------------------------------------------------------------------ */
  async findAll(filters: GetCarListDto, currentUser?: UserSub) {
    const { page, limit } = filters

    // 1) QB со счётчиками — для самой страницы
    const pageQB = this.buildListQuery(filters, currentUser, true)
      .skip((page - 1) * limit)
      .take(limit)

    const items = await this.mapIsLiked(pageQB, currentUser)

    // 2) QB без счётчиков — только для общего total
    const total = await this.buildListQuery(filters, undefined, false)
      .getCount()

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

  async toggleLike(carId: number, user: any) {
    // проверяем, есть ли лайк
    const existing = await this.likeRepo.findOne({
      where: { car: { id: carId }, user: { id: user.sub } },
    })

    if (existing) {
      await this.likeRepo.remove(existing)          // 👈 анлайк
    } else {
      await this.likeRepo.save(
        this.likeRepo.create({
          car: { id: carId } as any,
          user: { id: user.sub } as any,
        }),
      )                                             // 👈 лайк
    }

    // пересчитываем количество
    const likesCount = await this.likeRepo.count({
      where: { car: { id: carId } },
    })

    return { liked: !existing, likesCount }
  }

  async findAllNoModerated(user: any): Promise<CarIternal[]> {
    // 1) доступ только для ADMIN
    if ((!user) || (user && user.role !== 'ADMIN')) {
      throw new ForbiddenException('Access denied');
    }

    // 2) полный набор JOIN’ов, как в основном списке
    return this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.country', 'country')
      .leftJoinAndSelect('car.engineType', 'engine')
      .leftJoinAndSelect('car.bodyType', 'body')
      .leftJoinAndSelect('car.gearBox', 'gear')
      .leftJoinAndSelect('car.city', 'city')
      .leftJoinAndSelect('car.technologies', 'tech')
      .where('car.moderated = :moderated', { moderated: false })
      .getMany();
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
        'engineType',
        'bodyType',
        'gearBox',
        'technologies'
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

    /* ---------- 1. анти-спам ---------- */
    const pending = await this.carRepository.findOne({
      select: ['id'],
      where: { createdBy: { id: user.sub }, moderated: false },
    })
    if (pending) {
      throw new ForbiddenException(
        'У вас уже есть объявление, ожидающее модерации. Дождитесь проверки модератора.',
      )
    }
    /* ---------- валидируем справочники параллельно ---------- */
    const [
      model,
      brand,
      country,
      city,
      engine,
      body,
      gear,
      technologies,
    ] = await Promise.all([
      this.modelRepository.findOne({ where: { id: dto.modelId } }),
      this.brandRepository.findOne({ where: { id: dto.brandId } }),
      this.countryRepository.findOne({ where: { id: dto.countryId } }),
      this.cityRepository.findOne({ where: { id: dto.cityId } }),
      this.engineRepository.findOne({ where: { id: dto.engineTypeId } }),
      this.bodyRepository.findOne({ where: { id: dto.bodyTypeId } }),
      this.gearRepository.findOne({ where: { id: dto.gearBoxId } }),
      this.technologyRepository.findBy({ id: In(dto.technologyIds) }),
    ])

    /* --- если чего-то нет, кидаем 400 --- */
    if (!model) this.raiseFieldError('modelId', 'Модель не найдена')
    if (!brand) this.raiseFieldError('brandId', 'Бренд не найден')
    if (!country) this.raiseFieldError('countryId', 'Страна не найдена')
    if (!city) this.raiseFieldError('cityId', 'Город не найден')
    if (!engine) this.raiseFieldError('engineTypeId', 'Двигатель не найден')
    if (!body) this.raiseFieldError('bodyTypeId', 'Кузов не найден')
    if (!gear) this.raiseFieldError('gearBoxId', 'КПП не найдена')
    if (!technologies) this.raiseFieldError('technologyId', 'Технология не найдена')

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
      technologies,

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
