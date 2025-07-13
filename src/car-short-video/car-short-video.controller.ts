// src/car_short_videos/car-short-video.controller.ts
import {
    Controller,
    Post,
    Get,
    Query,
    UploadedFile,
    UseInterceptors,
    Body,
    Req,
    UseGuards,
    Patch,
    Param,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Request } from 'express'

import { CarShortVideoService } from './services/car-short-video.service'
import { CreateCarShortVideoDto } from './dto/create-car-short-video.dto'
interface UserSub {
    sub: number,
    role: string
}
@Controller('car-short-videos')
export class CarShortVideoController {
    constructor(private readonly service: CarShortVideoService) { }

    /* ------------------------------------------------------------------ */
    /*  Создание видео                                                    */
    /* ------------------------------------------------------------------ */
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(
        @Body() dto: CreateCarShortVideoDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request
    ) {
        const user = req.user as UserSub
        return this.service.create(dto, file, user)
    }

    /* ------------------------------------------------------------------ */
    /*  Публичный список                                                  */
    /* ------------------------------------------------------------------ */
    @Get()
    getVideos(
        @Query('brandId') brandId?: number,
        @Query('modelId') modelId?: number,
    ) {
        if (brandId && modelId) {
            return this.service.findByBrandAndModel(brandId, modelId)
        }
        if (brandId) {
            return this.service.findByBrand(brandId)
        }
        return this.service.findAll()
    }

    /* ------------------------------------------------------------------ */
    /*  Немодерированные (только ADMIN)                                   */
    /* ------------------------------------------------------------------ */
    @Get('no-moderated')
    @UseGuards(JwtAuthGuard)
    findAllNoModerated(@Req() req: Request) {
        return this.service.findAllNoModerated(req.user)
    }

    /* ------------------------------------------------------------------ */
    /*  Модерация                                                          */
    /* ------------------------------------------------------------------ */
    @Patch('moderate/:id')
    @UseGuards(JwtAuthGuard)
    moderateVideo(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        return this.service.moderateVideo(id, req.user)
    }

    @Post(':id/like')
    @UseGuards(JwtAuthGuard)
    async toggleLike(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        return this.service.toggleLike(id, req.user)
    }
}
