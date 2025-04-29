import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrand } from './entities/index';
import { CarBrandService } from './services/car-brand.service';
import { CarBrandController } from './car-brand.controller';
import { CarModel } from '../auto_model/entities/auto-model.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CarBrand, CarModel])],
    providers: [CarBrandService],
    controllers: [CarBrandController],
    exports: [CarBrandService, TypeOrmModule],
})
export class AutoBrandModule { }
