import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CarBrandService } from './services/car-brand.service';
import { CarBrandIternal } from './entities/car-brand.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateCarBrandDto } from './dto/create-car-brand.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { CarModelIternar } from 'src/auto_model_iternal/entities';

@ApiTags('Car Brands Iternal')
@Controller('brands-iternal-cars')
export class CarBrandController {
    constructor(private readonly carBrandService: CarBrandService) { }

    @Public()
    @Get()
    async findAll(): Promise<CarBrandIternal[]> {
        return await this.carBrandService.findAll();
    }

    @Get(':id/models')
    findModels(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CarModelIternar[]> {
        return this.carBrandService.findModelsByBrand(id)
    }

    @Public()
    @Post()
    async create(@Body() dto: CreateCarBrandDto): Promise<CarBrandIternal> {
        return await this.carBrandService.create(dto.name);
    }
}
