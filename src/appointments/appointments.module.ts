import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointments.entities';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { ScheduleException } from 'src/schedule-exception/entities/schedule-exceptions.entities';
import { CarServiceEntity } from 'src/services_cars/entities';

@Module({
    imports: [TypeOrmModule.forFeature([Appointment, ScheduleException, CarServiceEntity])],
    providers: [AppointmentsService],
    controllers: [AppointmentsController],
    exports: [AppointmentsService, TypeOrmModule],
})
export class AppointmentModule { }
