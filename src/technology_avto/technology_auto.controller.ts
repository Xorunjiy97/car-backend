import { Controller, Get, Post, Body } from '@nestjs/common';
import { MasterTypeService } from './services/technology_auto.service';
import { TechnologyAutoModel } from './entities/technology_auto.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateMasterTypeDto } from './dto/technology_auto.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('technology-auto')
@Controller('technology-auto')
export class MasterTypeController {
    constructor(private readonly gearService: MasterTypeService) { }

    @Public()
    @Get()
    async findAll(): Promise<TechnologyAutoModel[]> {
        return await this.gearService.findAll();
    }
    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.gearService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }

    @Post()
    async create(@Body() dto: CreateMasterTypeDto): Promise<TechnologyAutoModel> {
        return await this.gearService.create(dto.name);
    }
}
