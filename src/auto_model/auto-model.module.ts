import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModel } from './entities/index';
import { CarModelService } from './services/car-model.service';
import { CarModelController } from './car-model.controller';
import { AutoBrandModule } from '../auto_brand/auto-brand.module'; // Импортируем модуль брендов

@Module({
    imports: [TypeOrmModule.forFeature([CarModel]), AutoBrandModule],
    providers: [CarModelService],
    controllers: [CarModelController],
    exports: [CarModelService],
})
export class AutoModelModule { }
