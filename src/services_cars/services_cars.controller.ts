import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    Get,
    Patch,
    Param
} from '@nestjs/common'
import { CarServiceService } from './services/services_car.service'
import { CreateCarServiceDto } from './dto/create-service-car.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

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
    @Get()
    async findAll() {
        return this.carService.findAll()
    }
}