import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterModel } from './entities/index';
import { MasterTypeService } from './services/master_type.service';
import { MasterTypeController } from './master_type.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MasterModel])],
    providers: [MasterTypeService],
    controllers: [MasterTypeController],
    exports: [MasterTypeService, TypeOrmModule],
})
export class MasterModule { }
