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
    Delete,
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
        @Req() req: Request,
        @Query('brandId') brandId?: number,
        @Query('modelId') modelId?: number,
    ) {
        const currentUser = req.user as UserSub
        if (brandId && modelId) {
            return this.service.findByBrandAndModel(brandId, modelId, currentUser)
        }
        if (brandId) {
            return this.service.findByBrand(brandId, currentUser)
        }
        return this.service.findAll(currentUser)
    }

    @UseGuards(JwtAuthGuard)                    // лайкнутые доступны только авторизованному
    @Get('liked')
    getLikedVideos(
        @Req() req: Request,            // декоратор, возвращающий { sub, role }
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 20,
    ) {

        const currentUser = req.user as UserSub

        return this.service.findLikedByUser(currentUser, page, limit)
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    getMyVideos(
        @Req() req: Request,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
    ) {
        const currentUser = req.user as UserSub
        return this.service.findByAuthor(currentUser, page, limit)
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')                               // DELETE /car-short-videos/42
    softDelete(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        return this.service.softDelete(id, req.user as UserSub)
    }

    /* восстановить, если нужно */
    @UseGuards(JwtAuthGuard)
    @Patch(':id/restore')                        // PATCH /car-short-videos/42/restore
    restore(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        return this.service.restore(id, req.user as UserSub)
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
    @Get(':id')
    async getVideoById(@Param('id') id: number) {
        return this.service.findOne(+id)
    }
}
