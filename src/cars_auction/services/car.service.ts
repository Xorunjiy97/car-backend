import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../entities/index';
import { CarBrand } from '../../auto_brand/entities/car-brand.entity';
import { CarModel } from '../../auto_model/entities/auto-model.entity';
import { EngineModel } from '../../engine_type/entities/engine.entity';
import { CountryModel } from '../../country/entities/country.entity';
import { BodyModel } from '../../body_type/entities/body.entity';
import { GearModel } from '../../gear_box/entities/gear.entity';
import { CreateCarDto } from '../dto/create-car.dto';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { GetCarListDto } from '../dto/get-car-list.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
    @InjectRepository(CarBrand)
    private readonly brandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private readonly modelRepository: Repository<CarModel>,
    @InjectRepository(CountryModel)
    private readonly countryRepository: Repository<CountryModel>,
    @InjectRepository(EngineModel)
    private readonly engineRepository: Repository<EngineModel>,
    @InjectRepository(BodyModel)
    private readonly bodyRepository: Repository<BodyModel>,
    @InjectRepository(GearModel)
    private readonly gearRepository: Repository<GearModel>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(filters: GetCarListDto): Promise<Pagination<Car>> {
    const { page, limit } = filters
    console.log(filters,'filters')
  
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
      
  
    if (filters.priceFromMin ) query.andWhere('car.priceFrom >= :priceFromMin', { priceFromMin: filters.priceFromMin })
    if (filters.priceFromMax ) query.andWhere('car.priceFrom <= :priceFromMax', { priceFromMax: filters.priceFromMax })
  
    if (filters.mileageMin ) query.andWhere('car.mileage >= :mileageMin', { mileageMin: filters.mileageMin })
    if (filters.mileageMax ) query.andWhere('car.mileage <= :mileageMax', { mileageMax: filters.mileageMax })
  
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
  

  async findOne(id: number): Promise<Car> {
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

  async create(
    dto: CreateCarDto,
    avatarFile: Express.Multer.File,
    files: Express.Multer.File[],
  ): Promise<Car> {
    const model = await this.modelRepository.findOne({
      where: { id: dto.modelId },
    });
    if (!model) {
      throw new Error('Invalid model ID');
    }
    const brand = await this.brandRepository.findOne({
      where: { id: dto.brandId },
    });
    if (!brand) {
      throw new Error('Invalid brand ID');
    }

    const country = await this.countryRepository.findOne({
      where: { id: dto.countryId },
    });
    if (!country) {
      throw new Error('Invalid country ID');
    }

    const engine = await this.engineRepository.findOne({
      where: { id: dto.engineTypeId },
    });
    if (!engine) {
      throw new Error('Invalid engine type ID');
    }

    const body = await this.bodyRepository.findOne({
      where: { id: dto.bodyTypeId },
    });
    if (!body) {
      throw new Error('Invalid body type ID');
    }

    const gear = await this.gearRepository.findOne({
      where: { id: dto.gearBoxId },
    });
    if (!gear) {
      throw new Error('Invalid gear box ID');
    }

    // ✅ Сохраняем аватар и фотографии
    const avatarUrl = avatarFile
      ? `/uploads/cars/${avatarFile.filename}`
      : null;
    const photoUrls = Array.isArray(files)
      ? files.map((file) => `/uploads/cars/${file.filename}`)
      : [];

    const car = this.carRepository.create({
      ...dto,
      brand,
      model,
      country,
      engine_type: engine,
      body_type: body,
      gear_box: gear,
      avatar: avatarUrl,
      photos: photoUrls,
    });

    await this.cacheManager.del('cars_all'); // Очистка кэша

    return this.carRepository.save(car);
  }
}
