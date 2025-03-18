import { Controller, Get, Post, Body } from '@nestjs/common';
import { EngineService } from './services/engine.service';
import { EngineModel } from './entities/engine.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateEngineDto } from './dto/engine.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public

@ApiTags('Engine')
@Controller('engine')
export class EngineController {
    constructor(private readonly countryService: EngineService) { }

    @Get()
    async findAll(): Promise<EngineModel[]> {
        return await this.countryService.findAll();
    }

    @Public()
    @Post()
    async create(@Body() dto: CreateEngineDto): Promise<EngineModel> {
        return await this.countryService.create(dto.name);
    }
}
