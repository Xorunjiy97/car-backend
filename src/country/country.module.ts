import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModel } from './entities/index';
import { CountryService } from './services/country.service';
import { CountryConnroller } from './country.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CountryModel])],
    providers: [CountryService],
    controllers: [CountryConnroller],
    exports: [CountryService, TypeOrmModule],
})
export class CountryModule { }
