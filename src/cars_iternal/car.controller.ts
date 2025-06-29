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
  Delete
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
import * as path from 'path';
import * as fs from 'fs';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GetCarListDto } from './dto/get-car-list.dto';


@ApiTags('Cars Iternal') // ✅ Swagger категория
@Controller('cars_iternal')
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
  @Public()
  @Get()
  async findAll(@Query() query: GetCarListDto) {
    return this.carService.findAll(query)
  }
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Получить автомобиль по ID' })
  async findOne(@Param('id') id: number) {
    return await this.carService.findOne(id);
  }

  @Public()
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
  ) {
    const avatarFile = files.avatar?.[0] ?? null;
    const photoFiles = files.photos ?? [];

    return await this.carService.create(dto, avatarFile, photoFiles);
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
}
