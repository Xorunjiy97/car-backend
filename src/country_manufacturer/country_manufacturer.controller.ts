import { Controller, Get, Post, Body } from '@nestjs/common';
import { CountryManufacturerService } from './services/city.service';
import { CountryManufacturerModel } from './entities/country_manufacturer.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateCityDto } from './dto/city.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('City')
@Controller('city')
export class CountryManufacturerController {
    constructor(private readonly cityService: CountryManufacturerService) { }

    @Public()
    @Get()
    async findAll(): Promise<CountryManufacturerModel[]> {
        return await this.cityService.findAll();
    }


    @Post()
    async create(@Body() dto: CreateCityDto): Promise<CountryManufacturerModel> {
        return await this.cityService.create(dto.name);
    }
    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.cityService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }
}
