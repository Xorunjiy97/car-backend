// src/cars_lite/cars-lite.service.ts
import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository, SelectQueryBuilder } from 'typeorm'


import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities'
import { CarModelIternar } from 'src/auto_model_iternal/entities'
import { EngineModel } from 'src/engine_type/entities/engine.entity'
import { CountryManufacturerModel } from 'src/country_manufacturer/entities'
import { GearModel } from 'src/gear_box/entities/gear.entity'
import { TechnologyAutoModel } from 'src/technology_avto/entities'
import { CityModel } from 'src/city/entities'

import { StorageService } from 'src/shared/storage/s3.service'
import { CarIternalLite } from '../entities/car-internal-lite.entity'
import { CarLiteLikeEntity } from '../entities/car-lite-like.entity'
import { GetCarLiteListDto } from '../dto/get-car-list.dto'
import { CreateCarLiteDto } from '../dto/create-car.dto'
import { UpdateCarLiteDto } from '../dto/update-car.dto'

interface UserSub {
  sub: number
  role: string
}

@Injectable()
export class CarsLiteService {
  constructor(
    @InjectRepository(CarIternalLite)
    private readonly carRepo: Repository<CarIternalLite>,
    @InjectRepository(CarLiteLikeEntity)
    private readonly likeRepo: Repository<CarLiteLikeEntity>,

    @InjectRepository(CarBrandIternal)
    private readonly brandRepo: Repository<CarBrandIternal>,
    @InjectRepository(CarModelIternar)
    private readonly modelRepo: Repository<CarModelIternar>,
    @InjectRepository(CountryManufacturerModel)
    private readonly countryRepo: Repository<CountryManufacturerModel>,
    @InjectRepository(EngineModel)
    private readonly engineRepo: Repository<EngineModel>,
    @InjectRepository(GearModel)
    private readonly gearRepo: Repository<GearModel>,
    @InjectRepository(TechnologyAutoModel)
    private readonly techRepo: Repository<TechnologyAutoModel>,
    @InjectRepository(CityModel)
    private readonly cityRepo: Repository<CityModel>,

    private readonly storageService: StorageService,
  ) {}

  /* -------------------------------- helpers ------------------------------- */

  private raiseFieldError(field: string, message: string): never {
    throw new BadRequestException(
      { statusCode: HttpStatus.BAD_REQUEST, errors: [{ field, message }] },
      'ValidationError',
    )
  }

  private async mapIsLiked(
    qb: SelectQueryBuilder<CarIternalLite>,
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

  private buildListQuery(
    filters: GetCarLiteListDto,
    currentUser?: UserSub,
    withCounts = true,
  ) {
    const qb = this.carRepo
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.country', 'country')
      .leftJoinAndSelect('car.engineType', 'engine')
      .leftJoinAndSelect('car.gearBox', 'gear')
      .leftJoinAndSelect('car.technologies', 'tech')
      .leftJoinAndSelect('car.city', 'city')
      .where('car.moderated = :moderated', { moderated: true })
      .andWhere('car.deleted = false')

    // справочники
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
    if (filters.gearBoxId?.length)
      qb.andWhere('gear.id IN (:...gearBoxIds)', {
        gearBoxIds: filters.gearBoxId,
      })
    if (filters.numberOfSeats)
      qb.andWhere('car.numberOfSeats = :seats', {
        seats: filters.numberOfSeats,
      })

    // диапазоны
    if (filters.priceFromMin)
      qb.andWhere('car.price >= :pmin', { pmin: filters.priceFromMin })
    if (filters.priceFromMax)
      qb.andWhere('car.price <= :pmax', { pmax: filters.priceFromMax })
    if (filters.yearMin)
      qb.andWhere('car.year >= :ymin', { ymin: filters.yearMin })
    if (filters.yearMax)
      qb.andWhere('car.year <= :ymax', { ymax: filters.yearMax })

    // новый фильтр по driver
    if (filters.driver) qb.andWhere('car.driver = :driver', { driver: filters.driver })

    // лайки/избранное
    if (withCounts) {
      qb.loadRelationCountAndMap('car.likesCount', 'car.likes')
      if (currentUser) {
        qb.loadRelationCountAndMap(
          'car._isLikedTmp',
          'car.likes',
          'my_like',
          (sub) => sub.where('my_like.user_id = :uid', { uid: currentUser.sub }),
        )
      }
    }

    return qb
  }

  /* -------------------------------- create/update ---------------------------- */

async create(
  dto: CreateCarLiteDto,
  avatarFile: Express.Multer.File | undefined,
  files: Express.Multer.File[] | undefined,
  user: any,
): Promise<CarIternalLite> {
  // 1) антиспам
  const authorId = user?.sub ?? user?.id
  const pending = await this.carRepo.findOne({
    select: ['id'],
    where: { createdBy: { id: authorId }, moderated: false, deleted: false },
  })
  if (pending) {
    throw new ForbiddenException('У вас уже есть объявление, ожидающее модерации. Дождитесь проверки модератора.')
  }

  // 2) справочники
  const [model, brand, city, engine, gear] = await Promise.all([
    this.modelRepo.findOne({ where: { id: dto.modelId } }),
    this.brandRepo.findOne({ where: { id: dto.brandId } }),
    this.cityRepo.findOne({ where: { id: dto.cityId } }),
    this.engineRepo.findOne({ where: { id: dto.engineTypeId } }),
    this.gearRepo.findOne({ where: { id: dto.gearBoxId } }),
  ])

  if (!model) this.raiseFieldError('modelId', 'Модель не найдена')
  if (!brand) this.raiseFieldError('brandId', 'Бренд не найден')
  if (!city) this.raiseFieldError('cityId', 'Город не найден')
  if (!engine) this.raiseFieldError('engineTypeId', 'Двигатель не найден')
  if (!gear) this.raiseFieldError('gearBoxId', 'КПП не найдена')

  // 3) медиа
  const avatarUrl = avatarFile ? `/uploads/cars/${avatarFile.filename}` : null
  const photoUrls = Array.isArray(files) ? files.map((f) => `/uploads/cars/${f.filename}`) : []

  // 4) создание
  const car = this.carRepo.create({
    hpCount: dto.hp_count,
    numberOfSeats: dto.number_of_seats,
    enginePower: dto.engine_power,
    year: dto.year,
    price: dto.price,
    driver: dto.driver,

    userName: dto.user_name,
    userEmail: dto.user_email,
    userPhone: dto.user_phone,
    description: dto.description,
    moderated: dto.moderated ?? false,

    brand,
    model,
    city,
    engineType: engine,
    gearBox: gear,

    avatar: avatarUrl,
    photos: photoUrls,
    videoLink: dto.videoLink ?? null,

    createdBy: { id: authorId } as any,   // ✅ важно
    deleted: false,
  })

  return this.carRepo.save(car)
}


  async updateCar(
    id: number,
    dto: UpdateCarLiteDto,
    avatarFile: Express.Multer.File | undefined,
    files: Express.Multer.File[] | undefined,
    user: any,
  ): Promise<CarIternalLite> {
    const car = await this.carRepo.findOne({
      where: { id, deleted: false },
      relations: ['createdBy'],
    })
    if (!car) throw new NotFoundException('Авто не найдено')
    if (car.createdBy.id !== user.sub)
      throw new ForbiddenException('Нет доступа к этому авто')

    const [
      model,
      brand,
      city,
      engine,
      gear,
    ] = await Promise.all([
      dto.modelId ? this.modelRepo.findOne({ where: { id: dto.modelId } }) : null,
      dto.brandId ? this.brandRepo.findOne({ where: { id: dto.brandId } }) : null,
      dto.cityId ? this.cityRepo.findOne({ where: { id: dto.cityId } }) : null,
      dto.engineTypeId ? this.engineRepo.findOne({ where: { id: dto.engineTypeId } }) : null,
      dto.gearBoxId ? this.gearRepo.findOne({ where: { id: dto.gearBoxId } }) : null,
    ])

    const avatarUrl = avatarFile ? `/uploads/cars/${avatarFile.filename}` : car.avatar
    const photoUrls = Array.isArray(files)
      ? files.map((f) => `/uploads/cars/${f.filename}`)
      : car.photos

    Object.assign(car, {
      hpCount: dto.hp_count ?? car.hpCount,
      numberOfSeats: dto.number_of_seats ?? car.numberOfSeats,
      enginePower: dto.engine_power ?? car.enginePower,
      year: dto.year ?? car.year,
      price: dto.price ?? car.price,
      driver: dto.driver ?? car.driver,

      userName: dto.user_name ?? car.userName,
      userEmail: dto.user_email ?? car.userEmail,
      userPhone: dto.user_phone ?? car.userPhone,
      description: dto.description ?? car.description,
      moderated: false, // требуется повторная модерация

      avatar: avatarUrl,
      photos: photoUrls,
      videoLink: dto.videoLink ?? car.videoLink,
    })

    if (model) car.model = model
    if (brand) car.brand = brand
    if (city) car.city = city
    if (engine) car.engineType = engine
    if (gear) car.gearBox = gear

    return this.carRepo.save(car)
  }

  async remove(id: number): Promise<{ message: string }> {
    const car = await this.carRepo.findOne({ where: { id } })
    if (!car) throw new NotFoundException('Car not found')
    car.deleted = true
    await this.carRepo.save(car)
    return { message: `Автомобиль с ID ${id} помечен как удалённый` }
  }

  async moderateCar(id: number, user: any): Promise<CarIternalLite> {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Access denied')
    const car = await this.carRepo.findOne({ where: { id } })
    if (!car) throw new NotFoundException('Car not found')
    car.moderated = true
    return this.carRepo.save(car)
  }

  /* -------------------------------- listing/search --------------------------- */

  async findAll(filters: GetCarLiteListDto, currentUser?: UserSub) {
    const { page, limit } = filters

    const pageQB = this.buildListQuery(filters, currentUser, true)
      .skip((page - 1) * limit)
      .take(limit)

    const items = await this.mapIsLiked(pageQB, currentUser)
    const total = await this.buildListQuery(filters, undefined, false).getCount()

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

  async findByAuthor(currentUser: UserSub): Promise<CarIternalLite[]> {
    const userId = Number(currentUser?.sub)
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Некорректный ID пользователя')
    }

    const qb = this.carRepo
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.country', 'country')
      .leftJoinAndSelect('car.engineType', 'engine')
      .leftJoinAndSelect('car.gearBox', 'gear')
      .leftJoinAndSelect('car.technologies', 'tech')
      .leftJoinAndSelect('car.city', 'city')
      .where('car.createdBy = :userId', { userId })
      .andWhere('car.deleted = false')
      .loadRelationCountAndMap('car.likesCount', 'car.likes')
      .loadRelationCountAndMap(
        'car._isLikedTmp',
        'car.likes',
        'my_like',
        (sub) => sub.where('my_like.user_id = :uid', { uid: userId }),
      )

    return this.mapIsLiked(qb, currentUser)
  }

  async findLikedByUser(currentUser: UserSub): Promise<CarIternalLite[]> {
    const userId = Number(currentUser?.sub)
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('Некорректный ID пользователя')
    }

    const qb = this.carRepo
      .createQueryBuilder('car')
      .innerJoin('car.likes', 'like', 'like.user_id = :userId', {
        userId: currentUser.sub,
      })
      .leftJoinAndSelect('car.brand', 'brand')
      .leftJoinAndSelect('car.model', 'model')
      .leftJoinAndSelect('car.country', 'country')
      .leftJoinAndSelect('car.engineType', 'engine')
      .leftJoinAndSelect('car.gearBox', 'gear')
      .leftJoinAndSelect('car.technologies', 'tech')
      .leftJoinAndSelect('car.city', 'city')
      .loadRelationCountAndMap('car.likesCount', 'car.likes')
      .loadRelationCountAndMap(
        'car._isLikedTmp',
        'car.likes',
        'my_like',
        (sub) => sub.where('my_like.user_id = :uid', { uid: userId }),
      )
      .where('car.moderated = :moderated', { moderated: true })
      .andWhere('car.deleted = false')

    return this.mapIsLiked(qb, currentUser)
  }

  /* -------------------------------- likes ----------------------------------- */

  async toggleLike(carId: number, user: any) {
    const existing = await this.likeRepo.findOne({
      where: { car: { id: carId }, user: { id: user.sub } },
    })

    if (existing) {
      await this.likeRepo.remove(existing) // unlike
    } else {
      await this.likeRepo.save(
        this.likeRepo.create({
          car: { id: carId } as any,
          user: { id: user.sub } as any,
        }),
      )
    }

    const likesCount = await this.likeRepo.count({
      where: { car: { id: carId } },
    })

    return { liked: !existing, likesCount }
  }

  /* -------------------------------- media ----------------------------------- */

  async uploadVideoToS3(carId: number, videoFile: Express.Multer.File) {
    const videoUrl = await this.storageService.uploadCarVideoLikes(videoFile)
    await this.carRepo.update(carId, { videoLink: videoUrl, moderated: false })
    return { success: true, url: videoUrl }
  }

  /* -------------------------------- read one -------------------------------- */

  async findOne(id: number): Promise<CarIternalLite> {
    const car = await this.carRepo.findOne({
      where: { id },
      relations: [
        'brand',
        'model',
        'country',
        'engineType',
        'gearBox',
        'technologies',
        'city',
      ],
    })
    if (!car) throw new NotFoundException('Car not found')
    return car
  }
}
