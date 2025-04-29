import { Controller, Get, Post, Body } from '@nestjs/common';
import { CityService } from './services/city.service';
import { CityModel } from './entities/city.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateCityDto } from './dto/city.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('City')
@Controller('city')
export class CityConnroller {
    constructor(private readonly cityService: CityService) { }

    @Public()
    @Get()
    async findAll(): Promise<CityModel[]> {
        return await this.cityService.findAll();
    }


    @Post()
    async create(@Body() dto: CreateCityDto): Promise<CityModel> {
        return await this.cityService.create(dto.name);
    }
    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.cityService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }
}
