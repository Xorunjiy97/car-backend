import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    Get,
    Patch,
    Param,
    BadRequestException
} from '@nestjs/common'
import { CarServiceService } from './services/services_car.service'
import { CreateCarServiceDto } from './dto/create-service-car.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
    ApiTags, ApiOperation,
} from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { multerConfig } from 'multer.config';

@ApiTags('car-services')
@Controller('car-services')
export class CarServiceController {
    constructor(private readonly carService: CarServiceService) { }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'avatar', maxCount: 1 },
                { name: 'photos', maxCount: 10 },
            ],
            multerConfig, // твой конфиг с diskStorage
        ),
    )
    async create(
        @Body() dto: CreateCarServiceDto,
        @UploadedFiles()
        files: { avatar?: Express.Multer.File[]; photos?: Express.Multer.File[] },
    ) {
        const avatarFile = files.avatar?.[0]
        const photoFiles = files.photos || []

        return this.carService.create(dto, avatarFile, photoFiles)
    }
    @Post(':id/upload-video')
    @UseInterceptors(
        FileFieldsInterceptor([{ name: 'video', maxCount: 1 }]) // без multerConfig
    )
    async uploadVideo(
        @Param('id') id: number,
        @UploadedFiles() files: { video?: Express.Multer.File[] },
    ) {
        const videoFile = files.video?.[0]
        if (!videoFile) throw new BadRequestException('Видео не загружено')

        return this.carService.uploadVideoToS3(id, videoFile)
    }


    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Получить автомобиль по ID' })
    async findOne(@Param('id') id: number) {
        return await this.carService.findOne(id);
    }
    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() dto: CreateCarServiceDto,
        @UploadedFiles() files,
        user: User,
    ) {
        return this.carService.update(
            id,
            dto,
            user,
            files.avatar?.[0],
            files.photos,
            files.video?.[0],
        );
    }
    @Public()
    @Get()
    async findAll() {
        return this.carService.findAll()
    }
}