import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityModel } from './entities/index';
import { CityService } from './services/city.service';
import { CityConnroller } from './city.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CityModel])],
    providers: [CityService],
    controllers: [CityConnroller],
    exports: [CityService, TypeOrmModule],
})
export class CityModule { }
