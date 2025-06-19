import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModelIternar } from './entities/index';
import { CarModelService } from './services/car-model.service';
import { CarModelClassesIternalController } from './car-model.controller';
import { AutoBrandModule } from '../auto_brand/auto-brand.module'; // Импортируем модуль брендов
import { CarModelClassesIternal } from 'src/auto_model_iternal_classes/entities';
import {CarBrandIternal} from 'src/auta_brands_iternal_cars/entities'
@Module({
    imports: [TypeOrmModule.forFeature([CarModelIternar, CarModelClassesIternal,CarBrandIternal]), forwardRef(() => AutoBrandModule),],
    providers: [CarModelService],
    controllers: [CarModelClassesIternalController],
    exports: [CarModelService],
})
export class AutoModelIternalModule { }
