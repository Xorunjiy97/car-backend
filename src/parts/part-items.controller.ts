import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common'
import { Request } from 'express'

import { PartItemsService } from './services/part-items.service'
import { CreatePartItemDto } from './dto/create-part-item.dto'
import { UpdatePartItemDto } from './dto/update-part-item.dto'
import { QueryPartItemDto } from './dto/query-part-item.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { multerConfigParts } from '../../multer.config';

@Controller('part-items')
export class PartItemsController {
    constructor(private readonly service: PartItemsService) { }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'avatar', maxCount: 1 },
                { name: 'photos', maxCount: 5 },
            ],
            multerConfigParts,
        )
    )
    async create(
        @Body(new ValidationPipe({ transform: true })) dto: CreatePartItemDto,
        @UploadedFiles()
        files: {
            avatar?: Express.Multer.File[]
            photos?: Express.Multer.File[]
        },
        @Req() req: Request,
    ) {
        const avatarFile = files?.avatar?.[0] ?? undefined
        const photoFiles = files?.photos ?? []
        const user = req.user as any

        return this.service.create(dto, avatarFile, photoFiles, { id: user.sub })
    }

    @Get()
    findAll(@Query() q: QueryPartItemDto) {
        return this.service.findAll(q)
    }
    @Get('no-moderated')
    findAllNoModerater(@Query() q: QueryPartItemDto) {
        return this.service.findAllNoModerated(q)
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.service.findOne(Number(id))
    }

    @Patch(':id')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'avatar', maxCount: 1 },
                { name: 'photos', maxCount: 5 },
            ],
            multerConfigParts,
        )
    )
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePartItemDto,               // см. ниже
        @UploadedFiles() files: { avatar?: Express.Multer.File[], photos?: Express.Multer.File[] },
    ) {
        const avatarFile = files?.avatar?.[0]
        const photoFiles = files?.photos ?? []

        return this.service.update(id, dto, avatarFile, photoFiles)
    }


    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.service.softDelete(Number(id))
    }

    @Patch(':id/moderate')
    moderate(@Param('id') id: number) {
        return this.service.moderate(Number(id))
    }
}
