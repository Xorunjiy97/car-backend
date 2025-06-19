import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { CarModelClassInternaService } from './services/car-model.service';
import { CarModelClassesIternal } from './entities/index';
import { CreateCarModelDto } from './dto/create-car-model.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('Car Models Iternal Classes')
@Controller('models-classes')
export class CarModelIternalController {
    constructor(private readonly carModelService: CarModelClassInternaService) { }

    @Get()
    @ApiQuery({ name: 'brandId', required: false, example: 1 }) // ✅ Добавляем параметр brandId
    async findAll(@Query('brandId') brandId?: number) {
        return await this.carModelService.findAll(brandId);
    }

    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        // await this.carModelService.softDeleted(id);
        // return { message: 'Model deleted successfully' };
    }

    @Public()
    @Post()
    async create(@Body() dto: CreateCarModelDto) { // ✅ Используем DTO
        return await this.carModelService.create(dto);
    }
}
