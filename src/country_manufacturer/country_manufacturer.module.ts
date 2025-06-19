import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryManufacturerModel } from './entities/index';
import { CountryManufacturerService } from './services/city.service';
import { CountryManufacturerController } from './country_manufacturer.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CountryManufacturerModel])],
    providers: [CountryManufacturerService],
    controllers: [CountryManufacturerController],
    exports: [CountryManufacturerService, TypeOrmModule],
})
export class CityModule { }
