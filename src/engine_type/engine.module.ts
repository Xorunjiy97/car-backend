import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineModel } from './entities/index';
import { EngineService } from './services/engine.service';
import { EngineController } from './engine.controller';

@Module({
    imports: [TypeOrmModule.forFeature([EngineModel])],
    providers: [EngineService],
    controllers: [EngineController],
    exports: [EngineService, TypeOrmModule],
})
export class EngineModule { }
