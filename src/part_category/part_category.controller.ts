import { Controller, Get, Post, Body } from '@nestjs/common';
import { PartCategoryService } from './services/part_category.service';
import { PartCategory } from './entities/part_category.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreatePartCategoryDto } from './dto/create-part-category.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('Part Category')
@Controller('part-category')
export class PartCategoryController {
    constructor(private readonly partCategoryService: PartCategoryService) { }
    @Public()
    @Get()
    async findAll(): Promise<PartCategory[]> {
        return await this.partCategoryService.findAll();
    }

    @Post()
    async create(@Body() dto: CreatePartCategoryDto): Promise<PartCategory> {
        return await this.partCategoryService.create(dto.name);
    }
    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.partCategoryService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }

}
