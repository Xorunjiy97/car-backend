import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModelClassesIternal } from './entities/index';
import { CarModelIternar } from 'src/auto_model_iternal/entities';
import { CarModelClassInternaService } from './services/car-model.service';
import { CarModelIternalController } from './car-model.controller';
import { AutoBrandModule } from '../auto_brand/auto-brand.module'; // Импортируем модуль брендов

@Module({
    imports: [TypeOrmModule.forFeature([CarModelClassesIternal, CarModelIternar]), forwardRef(() => AutoBrandModule),],
    providers: [CarModelClassInternaService],
    controllers: [CarModelIternalController],
    exports: [CarModelClassInternaService],
})
export class AutoModeClasseslIternalModule { }
