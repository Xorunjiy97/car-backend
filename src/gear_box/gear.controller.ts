import { Controller, Get, Post, Body } from '@nestjs/common';
import { GearService } from './services/gear.service';
import { GearModel } from './entities/gear.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateGearDto } from './dto/gear.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public

@ApiTags('Gear')
@Controller('gear')
export class EngineController {
    constructor(private readonly countryService: GearService) { }

    @Get()
    async findAll(): Promise<GearModel[]> {
        return await this.countryService.findAll();
    }

    @Public()
    @Post()
    async create(@Body() dto: CreateGearDto): Promise<GearModel> {
        return await this.countryService.create(dto.name);
    }
}
