import { Controller, Get, Post, Body } from '@nestjs/common';
import { BodyService } from './services/body.service';
import { BodyModel } from './entities/body.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateBodyDto } from './dto/body.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('Body')
@Controller('body')
export class BodyController {
    constructor(private readonly bodyService: BodyService) { }

    @Public()
    @Get()
    async findAll(): Promise<BodyModel[]> {
        return await this.bodyService.findAll();
    }

    @Post()
    async create(@Body() dto: CreateBodyDto): Promise<BodyModel> {
        return await this.bodyService.create(dto.name);
    }
    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.bodyService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }
}
