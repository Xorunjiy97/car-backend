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
import { AutoModelModule } from './auto_model/auto-model.module';
import { CountryModule } from './country/country.module';
import { EngineModule } from './engine_type/engine.module';
import { BodyModule } from './body_type/body.module';
import { GearModule } from './gear_box/gear.module';
import { CarModule } from './cars_auction/car.module';


const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
  imports: [
    passportModule,
    ScheduleModule.forRoot(),
    CacheModule.register(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    GearModule,
    AutoBrandModule,
    AutoModelModule,
    EngineModule,
    BodyModule,
    CountryModule,
    CarModule
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
