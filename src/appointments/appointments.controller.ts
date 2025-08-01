import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    ParseIntPipe,
    BadRequestException,
} from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { UpdateAppointmentStatusDto } from './dto/update-status.dto'

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    async create(@Body() dto: CreateAppointmentDto) {
        return this.appointmentsService.create(dto)
    }

    @Get(':serviceId')
    async getByService(@Param('serviceId', ParseIntPipe) serviceId: number) {
        return this.appointmentsService.getByService(serviceId)
    }

    @Patch(':id/status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAppointmentStatusDto,
    ) {
        return this.appointmentsService.updateStatus(id, dto.status)
    }
}
