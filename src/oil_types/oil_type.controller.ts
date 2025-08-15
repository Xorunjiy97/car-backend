import { Controller, Get, Post, Body } from '@nestjs/common';
import { OilTypeService } from './services/oil_type.service';
import { OilType } from './entities/oil_types.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateOilTypeDto } from './dto/oil_types.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('Oil')
@Controller('oil-type')
export class OilTypeController {
    constructor(private readonly countryService: OilTypeService) { }
    @Public()
    @Get()
    async findAll(): Promise<OilType[]> {
        return await this.countryService.findAll();
    }

    @Post()
    async create(@Body() dto: CreateOilTypeDto): Promise<OilType> {
        return await this.countryService.create(dto.name);
    }
    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.countryService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }

}
