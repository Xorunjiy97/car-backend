import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologyAutoModel } from './entities/index';
import { MasterTypeService } from './services/technology_auto.service';
import { MasterTypeController } from './technology_auto.controller';

@Module({
    imports: [TypeOrmModule.forFeature([TechnologyAutoModel])],
    providers: [MasterTypeService],
    controllers: [MasterTypeController],
    exports: [MasterTypeService, TypeOrmModule],
})
export class TechnologyModule { }
