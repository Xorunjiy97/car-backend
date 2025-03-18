import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrand } from './entities/index';
import { CarBrandService } from './services/car-brand.service';
import { CarBrandController } from './car-brand.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CarBrand])],
    providers: [CarBrandService],
    controllers: [CarBrandController],
    exports: [CarBrandService, TypeOrmModule],
})
export class AutoBrandModule { }
