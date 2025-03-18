import { Controller, Get, Post, Body } from '@nestjs/common';
import { CarBrandService } from './services/car-brand.service';
import { CarBrand } from './entities/car-brand.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateCarBrandDto } from './dto/create-car-brand.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public

@ApiTags('Car Brands')
@Controller('brands')
export class CarBrandController {
    constructor(private readonly carBrandService: CarBrandService) { }

    @Public()
    @Get()
    async findAll(): Promise<CarBrand[]> {
        return await this.carBrandService.findAll();
    }

    @Public()
    @Post()
    async create(@Body() dto: CreateCarBrandDto): Promise<CarBrand> {
        return await this.carBrandService.create(dto.name);
    }
}
