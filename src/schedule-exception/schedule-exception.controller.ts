import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Delete,
    ParseIntPipe,
} from '@nestjs/common'
import { ScheduleExceptionService } from './schedule-exception.service'
import { CreateScheduleExceptionDto } from './dto/create-schedule-exception.dto'

@Controller('schedule-exceptions')
export class ScheduleExceptionController {
    constructor(
        private readonly scheduleExceptionService: ScheduleExceptionService,
    ) { }

    @Post()
    async create(@Body() dto: CreateScheduleExceptionDto) {
        return this.scheduleExceptionService.create(dto)
    }

    @Get(':serviceId')
    async getByService(@Param('serviceId', ParseIntPipe) serviceId: number) {
        return this.scheduleExceptionService.getByService(serviceId)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.scheduleExceptionService.delete(id)
    }
}
