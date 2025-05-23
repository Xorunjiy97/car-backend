import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { CarModelService } from './services/car-model.service';
import { CarModel } from './entities/index';
import { CreateCarModelDto } from './dto/create-car-model.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('Car Models')
@Controller('models')
export class CarModelController {
    constructor(private readonly carModelService: CarModelService) { }

    @Get()
    @ApiQuery({ name: 'brandId', required: false, example: 1 }) // ✅ Добавляем параметр brandId
    async findAll(@Query('brandId') brandId?: number) {
        return await this.carModelService.findAll(brandId);
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
