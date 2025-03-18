import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFiles, UploadedFile, Res } from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { CarService } from './services/car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { multerConfig } from '../../multer.config';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public

@ApiTags('Cars') // ✅ Swagger категория
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все автомобили' })
  async findAll() {
    return await this.carService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить автомобиль по ID' })
  async findOne(@Param('id') id: number) {
    return await this.carService.findOne(id);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Создать автомобиль с фото' })
  @UseInterceptors(
    FileInterceptor('avatar', multerConfig), // ✅ Загрузка 1 файла "avatar"
    FilesInterceptor('photos', 5, multerConfig) // ✅ Загрузка до 5 файлов "photos"
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
        auctionStartDate: { type: 'string', format: 'date', example: '2024-07-01' },
        year: { type: 'integer', example: 2022 },
        avatar: { type: 'string', format: 'binary' },
        photos: {
          type: 'array',
          items: { type: 'string', format: 'binary' }
        }
      }
    }
  })
  async create(
    @Body() dto: CreateCarDto,
    @UploadedFile() avatarFile: Express.Multer.File,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return await this.carService.create(dto, avatarFile, files);
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
