import { Injectable } from '@nestjs/common';
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
import {CountryManufacturerModel} from 'src/country_manufacturer/entities'
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

  async create(
    dto: CreateCarDto,
    avatarFile: Express.Multer.File | undefined,
    files: Express.Multer.File[] | undefined,
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

    if (!model) throw new Error('Invalid model ID')
    if (!brand) throw new Error('Invalid brand ID')
    if (!country) throw new Error('Invalid country ID')
    if (!city) throw new Error('Invalid city ID')
    if (!engine) throw new Error('Invalid engine type ID')
    if (!body) throw new Error('Invalid body type ID')
    if (!gear) throw new Error('Invalid gear box ID')
    if (!technology) throw new Error('Invalid technology ID')

    /* ----------------------- медиа-файлы --------------------- */
    const avatarUrl = avatarFile ? `/uploads/cars/${avatarFile.filename}` : null
    const photoUrls =
      Array.isArray(files) ? files.map(f => `/uploads/cars/${f.filename}`) : []

    /* --------- убираем ID-поля, чтобы не дублировать -------- */
    const {
      brandId,
      modelId,
      countryId,
      cityId,
      engineTypeId,
      bodyTypeId,
      gearBoxId,
      technologyId,
      ...rest // все остальные поля DTO: price, mileage, booleans и т.д.
    } = dto

    /* ------------------- создаём сущность ------------------- */
    const car = this.carRepository.create({
      ...rest,            // scalar-поля (color, price, mileage, …)
      brand,
      model,
      country,
      cityId: city,       // отношение на CityModel
      engine_type: engine,
      body_type: body,
      gear_box: gear,
      technology,
      avatar: avatarUrl,
      photos: photoUrls,
    })

    await this.cacheManager.del('cars_all') // очистка кэша

    return this.carRepository.save(car)
  }

}
