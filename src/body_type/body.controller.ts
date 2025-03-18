import { Controller, Get, Post, Body } from '@nestjs/common';
import { BodyService } from './services/body.service';
import { BodyModel } from './entities/body.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateBodyDto } from './dto/body.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public

@ApiTags('Body')
@Controller('body')
export class BodyController {
    constructor(private readonly countryService: BodyService) { }

    @Get()
    async findAll(): Promise<BodyModel[]> {
        return await this.countryService.findAll();
    }

    @Public()
    @Post()
    async create(@Body() dto: CreateBodyDto): Promise<BodyModel> {
        return await this.countryService.create(dto.name);
    }
}
