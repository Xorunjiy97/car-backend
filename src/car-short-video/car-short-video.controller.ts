import {
    Controller,
    Post,
    Get,
    Query,
    UploadedFile,
    UseInterceptors,
    Body,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CarShortVideoService } from './services/car-short-video.service'
import { CreateCarShortVideoDto } from './dto/create-car-short-video.dto'
import { PaginationQueryDto } from './dto/pagination-query.dto'
@Controller('car-short-videos')
export class CarShortVideoController {
    constructor(private readonly service: CarShortVideoService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    create(
        @Body() dto: CreateCarShortVideoDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.service.create(dto, file)
    }

    @Get()
    getVideos(
        @Query('brand') brand?: string,
        @Query('model') model?: string,
    ) {
        if (brand && model) {
            return this.service.findByBrandAndModel(brand, model)
        }
        if (brand) {
            return this.service.findByBrand(brand)
        }
        return this.service.findAll()
    }
}
