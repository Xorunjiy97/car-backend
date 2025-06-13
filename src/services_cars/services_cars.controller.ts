import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    Get,
    Patch,
    Param,
    BadRequestException,
    UseGuards,
    Query,
    Req
} from '@nestjs/common'
import { CarServiceService } from './services/services_car.service'
import { CreateCarServiceDto } from './dto/create-service-car.dto'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import {
    ApiTags, ApiOperation,
} from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { Public } from '../auth/decorators/can-be-public.decorator'; // ✅ Импортируем Public
import { multerConfigServices } from 'multer.config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express'
import { CarServiceFiltersDto } from './dto/car-service-filters.dto';
import { AuthGuard } from '@nestjs/passport';

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
            multerConfigServices, // твой конфиг с diskStorage
        ),
    )
    async create(
        @Body() dto: CreateCarServiceDto,
        @UploadedFiles()
        files: { avatar?: Express.Multer.File[]; photos?: Express.Multer.File[] },
        @Req() req: Request,
    ) {
        const avatarFile = files.avatar?.[0]
        const photoFiles = files.photos || []
        const user = req.user as any

        return this.carService.create(dto, avatarFile, photoFiles, { id: user.sub })
    }

    @Patch('moderate/:id')
    @UseGuards(JwtAuthGuard)
    async moderateService(
        @Param('id') id: number,
        @Req() req: Request,
    ) {
        return this.carService.moderateService(id, req.user)
    }

    @Get('no-moderated')
    @UseGuards(JwtAuthGuard)
    async findAllNoModerated(@Req() req: Request) {
        const user = req.user
        return this.carService.findAllNoModerated(user)
    }

    @Post(':id/upload-video')
    @UseGuards(JwtAuthGuard)
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
    async findAll(@Query() query: CarServiceFiltersDto) {
        console.log(query, 'query')
        return this.carService.findAll(query)
    }
}