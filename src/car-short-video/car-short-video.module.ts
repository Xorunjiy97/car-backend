import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CarShortVideoEntity } from './entities/car-short-video.entity'
import { CarShortVideoService } from './services/car-short-video.service'
import { CarShortVideoController } from './car-short-video.controller'
import { StorageService } from '../shared/storage/s3.service'
import { AppConfigService } from '../config/config.service'
import { CarBrandIternal } from '../auta_brands_iternal_cars/entities';
import { CarModelIternar } from '../auto_model_iternal/entities';
import { CarShortVideoLikeEntity } from './entities/car-short-likes-video.entity'
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CarShortVideoEntity, CarShortVideoLikeEntity, CarBrandIternal, CarModelIternar, User])],
    controllers: [CarShortVideoController],
    providers: [CarShortVideoService, StorageService, AppConfigService],
})
export class CarShortVideoModule { }
