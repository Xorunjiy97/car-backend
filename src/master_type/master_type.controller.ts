import { Controller, Get, Post, Body } from '@nestjs/common';
import { MasterTypeService } from './services/master_type.service';
import { MasterModel } from './entities/master_type.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateMasterTypeDto } from './dto/master_type.dto';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { Delete, Param } from '@nestjs/common';

@ApiTags('master-type')
@Controller('master-type')
export class MasterTypeController {
    constructor(private readonly gearService: MasterTypeService) { }

    @Public()
    @Get()
    async findAll(): Promise<MasterModel[]> {
        return await this.gearService.findAll();
    }
    @Delete(':id')
    async softDelete(@Param('id') id: number) {
        await this.gearService.softDeleted(id);
        return { message: 'Model deleted successfully' };
    }

    @Post()
    async create(@Body() dto: CreateMasterTypeDto): Promise<MasterModel> {
        return await this.gearService.create(dto.name);
    }
}
