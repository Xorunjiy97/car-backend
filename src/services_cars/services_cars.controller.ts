import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    Get,
} from '@nestjs/common'
import { CarServiceService } from './services/services_car.service'
import { CreateCarServiceDto } from './dto/create-service-car.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger';

@ApiTags('car-services')
@Controller('car-services')
export class CarServiceController {
    constructor(private readonly carService: CarServiceService) { }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'avatar', maxCount: 1 },
            { name: 'photos', maxCount: 10 },
            { name: 'video', maxCount: 1 }, // <--- новое поле для видео
        ]),
    )
    async create(
        @Body() dto: CreateCarServiceDto,
        @UploadedFiles() files: { avatar?: Express.Multer.File[]; photos?: Express.Multer.File[]; video?: Express.Multer.File[] },
    ) {
        const avatarFile = files.avatar?.[0]
        const photoFiles = files.photos || []
        const videoFile = files.video?.[0]

        return this.carService.create(dto, avatarFile, photoFiles, videoFile)
    }
    @Get()
    async findAll() {
        return this.carService.findAll()
    }
}