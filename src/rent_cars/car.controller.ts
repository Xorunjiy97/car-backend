// src/cars_lite/cars-lite.controller.ts
import {
  Controller, Get, Post, Body, Param, UseInterceptors,
  UploadedFiles, Req, Patch, Delete, BadRequestException,
  UseGuards, ParseIntPipe,
  Query
} from '@nestjs/common'
import {
  ApiTags, ApiConsumes, ApiBody, ApiQuery, ApiOperation
} from '@nestjs/swagger'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'


import { Public } from 'src/auth/decorators/can-be-public.decorator'
import { CarsLiteService } from './services/car.service'
import { GetCarLiteListDto } from './dto/get-car-list.dto'
import { CreateCarLiteDto } from './dto/create-car.dto'
import { UpdateCarLiteDto } from './dto/update-car.dto'
import { multerConfig } from 'multer.config'

// опциональный guard: допускает анонимов (для списка/карточек)
class JwtOptionalGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) { return user ?? null }
}

@ApiTags('Rent Cars')
@Controller('rent-cars')
export class CarsLiteController {
  constructor(private readonly svc: CarsLiteService) { }

  /* ------------------------------ LIST ------------------------------ */

  @ApiOperation({ summary: 'Список lite-объявлений (пагинация и фильтры)' })
  @UseGuards(JwtOptionalGuard)
  @Get()
  async findAll(@Req() req: Request, @Query() query: GetCarLiteListDto) {
    const user = req.user as any
    return this.svc.findAll(query, user)
  }

  /* ------------------------------ READ ONE ------------------------------ */

  @UseGuards(JwtOptionalGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as any | null  // анонимы тоже пройдут
    return this.svc.findOneWithLikes(id, user ?? undefined)
  }

  /* ------------------------------ MINE / LIKED ------------------------------ */

  @ApiOperation({ summary: 'Мои lite-объявления' })
  @UseGuards(JwtAuthGuard)
  @Get('my/list')
  async myList(@Req() req: Request) {
    return this.svc.findByAuthor(req.user as any)
  }

  @ApiOperation({ summary: 'Понравившиеся lite-объявления' })
  @UseGuards(JwtAuthGuard)
  @Get('liked')
  async liked(@Req() req: Request) {
    return this.svc.findLikedByUser(req.user as any)
  }

  /* ------------------------------ CREATE ------------------------------ */

  @ApiOperation({ summary: 'Создать lite-объявление с фото/видео' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'photos', maxCount: 5 },
      ],
      multerConfig,
    )
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCarLiteDto })
  @Post()
  async create(
    @Body() dto: CreateCarLiteDto,
    @UploadedFiles() files: { avatar?: Express.Multer.File[], photos?: Express.Multer.File[] },
    @Req() req: Request,
  ) {
    const avatarFile = files.avatar?.[0]
    const photoFiles = files.photos ?? []
    return this.svc.create(dto, avatarFile, photoFiles, req.user)
  }

  /* ------------------------------ UPDATE ------------------------------ */

  @ApiOperation({ summary: 'Обновить lite-объявление' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'photos', maxCount: 21 },
  ]))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCarLiteDto,
    @UploadedFiles() files: { avatar?: Express.Multer.File[], photos?: Express.Multer.File[] },
    @Req() req: Request,
  ) {
    return this.svc.updateCar(id, dto, files?.avatar?.[0], files?.photos, req.user)
  }

  /* ------------------------------ DELETE (soft) ------------------------------ */

  @ApiOperation({ summary: 'Удалить (soft) lite-объявление' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id)
  }

  /* ------------------------------ MODERATION ------------------------------ */

  @ApiOperation({ summary: 'Пометить как промодерированное (ADMIN)' })
  @UseGuards(JwtAuthGuard)
  @Patch('moderate/:id')
  async moderate(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.svc.moderateCar(id, req.user)
  }

  /* ------------------------------ MEDIA ------------------------------ */

  @ApiOperation({ summary: 'Загрузить видео в S3' })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'video', maxCount: 1 }]))
  @Post(':id/upload-video')
  async uploadVideo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: { video?: Express.Multer.File[] },
  ) {
    const videoFile = files.video?.[0]
    if (!videoFile) throw new BadRequestException('Видео не загружено')
    return this.svc.uploadVideoToS3(id, videoFile)
  }

  /* ------------------------------ LIKES ------------------------------ */

  @ApiOperation({ summary: 'Поставить/снять лайк' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.svc.toggleLike(id, req.user)
  }
}
