import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleExceptionController } from './schedule-exception.controller';
import { ScheduleExceptionService } from './schedule-exception.service';
import { ScheduleException } from './entities/schedule-exceptions.entities';
import { CarServiceEntity } from 'src/services_cars/entities';

@Module({
    imports: [TypeOrmModule.forFeature([ScheduleException, CarServiceEntity])],
    providers: [ScheduleExceptionService],
    controllers: [ScheduleExceptionController],
    exports: [ScheduleExceptionService, TypeOrmModule],
})
export class ScheduleExceptionModule { }
