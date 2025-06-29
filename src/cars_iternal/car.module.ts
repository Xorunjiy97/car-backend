import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CarIternal } from './entities/cars-iternal.entity';
import { CarService } from './services/car.service';
import { CarController } from './car.controller';
import { CarBrandIternal } from '../auta_brands_iternal_cars/entities';
import { CarModelIternar } from '../auto_model_iternal/entities';
import { EngineModel } from '../engine_type/entities/engine.entity';
import { BodyModel } from '../body_type/entities/body.entity';
import { GearModel } from '../gear_box/entities/gear.entity';
import { CityModel } from 'src/city/entities';
import { TechnologyAutoModel } from 'src/technology_avto/entities';
import { CountryManufacturerModel } from 'src/country_manufacturer/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarIternal, TechnologyAutoModel,CountryManufacturerModel, CarBrandIternal, CityModel, CarModelIternar, EngineModel, BodyModel, GearModel]),
    CacheModule.register({ ttl: 3600 }), // ✅ Добавляем кэширование
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarIternalModule { }
