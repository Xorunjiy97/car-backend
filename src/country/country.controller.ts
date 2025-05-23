import { Controller, Get, Post, Body } from '@nestjs/common';
import { CountryService } from './services/country.service';
import { CountryModel } from './entities/country.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateCountyDto } from './dto/country.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('Country')
@Controller('country')
export class CountryConnroller {
    constructor(private readonly countryService: CountryService) { }

    @Public()
    @Get()
    async findAll(): Promise<CountryModel[]> {
        return await this.countryService.findAll();
    }


    @Post()
    async create(@Body() dto: CreateCountyDto): Promise<CountryModel> {
        return await this.countryService.create(dto.name);
    }
    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.countryService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }
}
