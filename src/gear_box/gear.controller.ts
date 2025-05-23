import { Controller, Get, Post, Body } from '@nestjs/common';
import { GearService } from './services/gear.service';
import { GearModel } from './entities/gear.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateGearDto } from './dto/gear.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('Gear')
@Controller('gear')
export class EngineController {
    constructor(private readonly gearService: GearService) { }

    @Public()
    @Get()
    async findAll(): Promise<GearModel[]> {
        return await this.gearService.findAll();
    }
    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.gearService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }

    @Post()
    async create(@Body() dto: CreateGearDto): Promise<GearModel> {
        return await this.gearService.create(dto.name);
    }
}
