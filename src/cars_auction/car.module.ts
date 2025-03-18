import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/casr-auction.entity';
import { CarService } from './services/car.service';
import { CarController } from './car.controller';
import { CarBrand } from '../auto_brand/entities/car-brand.entity';
import { CarModel } from '../auto_model/entities/auto-model.entity';
import { EngineModel } from '../engine_type/entities/engine.entity';
import { CountryModel } from '../country/entities/country.entity';
import { BodyModel } from '../body_type/entities/body.entity';
import { GearModel } from '../gear_box/entities/gear.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car, CarBrand, CarModel, EngineModel, CountryModel, BodyModel, GearModel]),
    CacheModule.register({ ttl: 3600 }), // ✅ Добавляем кэширование
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
