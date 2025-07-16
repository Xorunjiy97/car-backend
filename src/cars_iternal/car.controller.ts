import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Res,
  Query,
  Delete,
  UseGuards,
  BadRequestException,
  Req,
  Patch,
  Injectable,
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import { CarService } from './services/car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { multerConfig } from '../../multer.config';
import { Response } from 'express';
import { Request } from 'express'

import * as path from 'path';
import * as fs from 'fs';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetCarListDto } from './dto/get-car-list.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    return user ?? null   // нет пользователя – продолжаем как аноним
  }
}

@ApiTags('Cars Iternal') // ✅ Swagger категория
@Controller('cars-iternal')
export class CarController {
  constructor(private readonly carService: CarService) { }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить автомобиль по ID' })
  async remove(@Param('id') id: number) {
    return await this.carService.remove(id)
  }

  @Get()
  @ApiOperation({ summary: 'Получить автомобили с пагинацией и кэшированием' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Количество элементов на странице',
  })
  @UseGuards(JwtOptionalGuard)
  @Get()
  async findAll(@Req() req: Request, @Query() query: GetCarListDto,) {
    const user = req.user as any
    return this.carService.findAll(query, user)
  }
  @Post(':id/upload-video')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'video', maxCount: 1 }]) // без multerConfig
  )
  @UseGuards(JwtAuthGuard)
  @Get('is-owner')
  async isOwner(@Query('id') id: number, @Req() req: Request) {
    if (!id) {
      throw new BadRequestException('Service ID is required')
    }

    const user = req.user as any // типизируй под свою сущность пользователя

    const isOwner = await this.carService.isCreatedByUser(id, { id: user.sub })
    return { isOwner }
  }
  async uploadVideo(
    @Param('id') id: number,
    @UploadedFiles() files: { video?: Express.Multer.File[] },
  ) {
    const videoFile = files.video?.[0]

    if (!videoFile) throw new BadRequestException('Видео не загружено')

    return this.carService.uploadVideoToS3(id, videoFile)
  }
  @Get('no-moderated')
  @UseGuards(JwtAuthGuard)
  async findAllNoModerated(@Req() req: Request) {
    const user = req.user
    return this.carService.findAllNoModerated(user)
  }

  @Patch('moderate/:id')
  @UseGuards(JwtAuthGuard)
  async moderateService(
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    return this.carService.moderateService(id, req.user)
  }
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Получить автомобиль по ID' })
  async findOne(@Param('id') id: number) {
    return await this.carService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Создать автомобиль с фото' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'photos', maxCount: 5 },
      ],
      multerConfig,
    )
  )
  @ApiConsumes('multipart/form-data') // ✅ Swagger поддержка form-data
  @ApiBody({
    description: 'Создание автомобиля с загрузкой фото',
    type: CreateCarDto,
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Mercedes G-Class' },
        brandId: { type: 'integer', example: 1 },
        modelId: { type: 'integer', example: 2 },
        countryId: { type: 'integer', example: 3 },
        engineTypeId: { type: 'integer', example: 4 },
        bodyTypeId: { type: 'integer', example: 5 },
        gearBoxId: { type: 'integer', example: 6 },
        hp_count: { type: 'integer', example: 200 },
        drive_train: { type: 'string', example: 'AWD' },
        priceFrom: { type: 'number', example: 50000 },
        priceTo: { type: 'number', example: 70000 },
        mileage: { type: 'integer', example: 50000 },
        engine_power: { type: 'integer', example: 300 },
        auctionStartDate: {
          type: 'string',
          format: 'date',
          example: '2024-07-01',
        },
        year: { type: 'integer', example: 2022 },
        avatar: { type: 'string', format: 'binary' },
        photos: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  async create(
    @Body() dto: CreateCarDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[],
      photos?: Express.Multer.File[],
    },
    @Req() req: Request,

  ) {
    console.log('RAW DTO --------', dto)
    const avatarFile = files.avatar?.[0] ?? null;
    const photoFiles = files.photos ?? [];
    const user = req.user as any
    console.log(user)


    return await this.carService.create(dto, avatarFile, photoFiles, { id: user.sub });
  }
  // ✅ API для получения фото по URL
  @Get('photo/:filename')
  @ApiOperation({ summary: 'Получить фото по имени файла' })
  async getPhoto(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '../../../uploads/cars', filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    return this.carService.toggleLike(id, req.user)
  }
}
