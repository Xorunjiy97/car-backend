import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateScheduleExceptionDto } from './dto/create-schedule-exception.dto'
import { CarServiceEntity } from 'src/services_cars/entities'
import { CarService } from 'src/cars_auction/services/car.service'
import { ScheduleException } from './entities/schedule-exceptions.entities'

@Injectable()
export class ScheduleExceptionService {
    constructor(
        @InjectRepository(ScheduleException)
        private readonly exceptionRepo: Repository<ScheduleException>,

        @InjectRepository(CarServiceEntity)
        private readonly serviceRepo: Repository<CarServiceEntity>,
    ) { }

    async create(dto: CreateScheduleExceptionDto) {
        const service = await this.serviceRepo.findOne({
            where: { id: dto.serviceId },
        })
        if (!service) throw new NotFoundException('Сервис не найден')

        const alreadyExists = await this.exceptionRepo.findOne({
            where: {
                service: { id: dto.serviceId },
                date: dto.date,
                time: dto.time ?? null,
            },
        })

        if (alreadyExists) {
            throw new BadRequestException('Исключение на это время уже существует')
        }

        const exception = this.exceptionRepo.create({
            date: dto.date,
            time: dto.time,
            isClosed: true,
            service,
        })

        return this.exceptionRepo.save(exception)
    }

    async getByService(serviceId: number) {
        return this.exceptionRepo.find({
            where: { service: { id: serviceId } },
            order: { date: 'ASC', time: 'ASC' },
        })
    }

    async delete(id: number) {
        const exception = await this.exceptionRepo.findOne({ where: { id } })
        if (!exception) throw new NotFoundException('Исключение не найдено')

        return this.exceptionRepo.remove(exception)
    }
}
