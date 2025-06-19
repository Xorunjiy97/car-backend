import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { CarModelService } from './services/car-model.service';
import { CreateCarModelDto } from './dto/create-car-model.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('Car Models Iternal')
@Controller('models-iternal')
export class CarModelClassesIternalController {
    constructor(private readonly carModelService: CarModelService) { }

    @Get()
    // ✅ Добавляем параметр brandId
    async findAll() {
        return await this.carModelService.findAll();
    }

    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.carModelService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }

    @Public()
    @Post()
    async create(@Body() dto: CreateCarModelDto) { // ✅ Используем DTO
        return await this.carModelService.create(dto);
    }
}
