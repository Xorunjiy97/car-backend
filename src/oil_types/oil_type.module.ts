import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OilType } from './entities/index';
import { OilTypeService } from './services/oil_type.service';
import { OilTypeController } from './oil_type.controller';

@Module({
    imports: [TypeOrmModule.forFeature([OilType])],
    providers: [OilTypeService],
    controllers: [OilTypeController],
    exports: [OilTypeService, TypeOrmModule],
})
export class OilTypeModule { }
