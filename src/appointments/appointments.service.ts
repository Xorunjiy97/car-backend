import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { Appointment } from './entities'
import { CarServiceEntity } from 'src/services_cars/entities'
import { ScheduleException } from 'src/schedule-exception/entities/schedule-exceptions.entities'

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private readonly appointmentRepo: Repository<Appointment>,

        @InjectRepository(CarServiceEntity)
        private readonly serviceRepo: Repository<CarServiceEntity>,

        @InjectRepository(ScheduleException)
        private readonly exceptionRepo: Repository<ScheduleException>,
    ) { }

    async create(dto: CreateAppointmentDto) {
        const service = await this.serviceRepo.findOne({
            where: { id: dto.serviceId },
            relations: ['workingDays'], // загружаем связанные рабочие дни
        })

        if (!service) throw new NotFoundException('Сервис не найден')

        const dayOfWeek = new Date(dto.date).getDay()

        const allowedDays = service.workingDays.map((d) => d.dayOfWeek)
        if (!allowedDays.includes(dayOfWeek)) {
            throw new BadRequestException('Этот день нерабочий.')
        }

        const exceptions = await this.exceptionRepo.find({
            where: {
                service: { id: dto.serviceId },
                date: dto.date,
            },
        })

        const isClosed = exceptions.some(
            (ex) => !ex.time || ex.time === dto.time,
        )

        if (isClosed) {
            throw new BadRequestException('Выбранная дата/время недоступны.')
        }

        const appointment = this.appointmentRepo.create({
            ...dto,
            status: 'waiting',
            service,
        })

        return this.appointmentRepo.save(appointment)
    }


    async getByService(serviceId: number) {
        return this.appointmentRepo.find({
            where: { service: { id: serviceId } },
            order: { date: 'ASC', time: 'ASC' },
        })
    }

    async updateStatus(id: number, status: 'waiting' | 'arrived' | 'late' | 'cancelled') {
        const appointment = await this.appointmentRepo.findOne({ where: { id } })
        if (!appointment) throw new NotFoundException('Встреча не найдена')

        appointment.status = status
        return this.appointmentRepo.save(appointment)
    }
}
