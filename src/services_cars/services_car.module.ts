// --- car-service.module.ts ---
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CarServiceController } from './services_cars.controller'
import { CarServiceService } from './services/services_car.service'
import { CarServiceEntity } from './entities/service_cars.entity'

import { CountryModel } from '../country/entities/country.entity';

import { MasterModel } from '../master_type/entities/master_type.entity'
import { CarBrand } from '../auto_brand/entities/car-brand.entity';
import { CarModel } from '../auto_model/entities/auto-model.entity';
import { StorageModule } from '../shared/storage/storage.module'
import { Appointment } from 'src/appointments/entities'
import { ScheduleException } from 'src/schedule-exception/entities/schedule-exceptions.entities'
import { CarServiceWorkingDay } from './entities/car-service-working-day.entity'


@Module({
    imports: [
        TypeOrmModule.forFeature([
            CarServiceEntity,
            CountryModel,
            CarBrand,
            CarModel,
            MasterModel,
            Appointment,
            ScheduleException, CarServiceWorkingDay
        ]),
        StorageModule
    ],
    controllers: [CarServiceController],
    providers: [CarServiceService],
})
export class CarServiceModule { }
