import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AutoBrandModule } from './auto_brand/auto-brand.module';
import { AutoBrandModuleIternal } from './auta_brands_iternal_cars/car-brand.module';

import { AutoModelModule } from './auto_model/auto-model.module';
import { CountryModule } from './country/country.module';
import { EngineModule } from './engine_type/engine.module';
import { BodyModule } from './body_type/body.module';
import { GearModule } from './gear_box/gear.module';
import { CarModule } from './cars_auction/car.module';
import { MasterModule } from './master_type/master_type.module'
import { CarServiceModule } from './services_cars/services_car.module'
import { CityModule } from './city/city.module';
import { AutoModelIternalModule } from './auto_model_iternal/auto-model.module'
import { AutoModeClasseslIternalModule } from './auto_model_iternal_classes/auto-model.module';
import { CarIternalModule } from './cars_iternal/car.module';
import { TechnologyModule } from './technology_avto/technology_auto.module';
import { CountryManufacturerModule } from './country_manufacturer/country_manufacturer.module'
import { CarShortVideoModule } from './car-short-video/car-short-video.module';
import { ScheduleExceptionModule } from './schedule-exception/schedule-exception.module';
import { AppointmentModule } from './appointments/appointments.module';
const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
  imports: [
    passportModule,
    ScheduleModule.forRoot(),
    CacheModule.register(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CarShortVideoModule,
    GearModule,
    AutoBrandModule,
    AutoModelModule,
    EngineModule,
    BodyModule,
    CountryModule,
    CarModule,
    MasterModule,
    CityModule,
    CarServiceModule,
    AutoBrandModuleIternal,
    AutoModelIternalModule,
    AutoModeClasseslIternalModule,
    CountryManufacturerModule,
    TechnologyModule,
    CarIternalModule,
    ScheduleExceptionModule,
    AppointmentModule
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
