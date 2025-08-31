// src/cars_lite/cars-lite.module.ts
import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TypeOrmModule } from '@nestjs/typeorm'



import { CarIternalLite } from './entities/car-internal-lite.entity'
import { CarLiteLikeEntity } from './entities/car-lite-like.entity'

import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities'
import { CarModelIternar } from 'src/auto_model_iternal/entities'
import { EngineModel } from 'src/engine_type/entities/engine.entity'
import { GearModel } from 'src/gear_box/entities/gear.entity'
import { CityModel } from 'src/city/entities'
import { TechnologyAutoModel } from 'src/technology_avto/entities'
import { CountryManufacturerModel } from 'src/country_manufacturer/entities'

import { StorageModule } from 'src/shared/storage/storage.module'
import { CarsLiteController } from './car.controller'
import { CarsLiteService } from './services/car.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarIternalLite,
      CarLiteLikeEntity,
      TechnologyAutoModel,
      CountryManufacturerModel,
      CarBrandIternal,
      CityModel,
      CarModelIternar,
      EngineModel,
      GearModel,
    ]),
    StorageModule,
    CacheModule.register({ ttl: 3600 }),
  ],
  controllers: [CarsLiteController],
  providers: [CarsLiteService],
})
export class RentCarsModule {}
