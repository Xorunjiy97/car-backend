import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodyModel } from './entities/index';
import { BodyService } from './services/body.service';
import { BodyController } from './body.controller';

@Module({
    imports: [TypeOrmModule.forFeature([BodyModel])],
    providers: [BodyService],
    controllers: [BodyController],
    exports: [BodyService, TypeOrmModule],
})
export class BodyModule { }
