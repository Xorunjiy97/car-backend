import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GearModel } from './entities/index';
import { GearService } from './services/gear.service';
import { EngineController } from './gear.controller';

@Module({
    imports: [TypeOrmModule.forFeature([GearModel])],
    providers: [GearService],
    controllers: [EngineController],
    exports: [GearService, TypeOrmModule],
})
export class GearModule { }
