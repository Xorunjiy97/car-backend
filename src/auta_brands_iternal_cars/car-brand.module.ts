import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrandIternal } from './entities/index';
import { CarBrandService } from './services/car-brand.service';
import { CarBrandController } from './car-brand.controller';
import { CarModelIternar } from 'src/auto_model_iternal/entities';

@Module({
    imports: [TypeOrmModule.forFeature([CarBrandIternal, CarModelIternar])],
    providers: [CarBrandService],
    controllers: [CarBrandController],
    exports: [CarBrandService, TypeOrmModule],
})
export class AutoBrandModuleIternal { }
