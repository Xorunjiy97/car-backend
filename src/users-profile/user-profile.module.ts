import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { CarIternal } from 'src/cars_iternal/entities/cars-iternal.entity'
import { CarServiceEntity } from 'src/services_cars/entities'
import { PartItem } from 'src/parts/entities'
import { UsersProfileController } from './users-profile.controller'
import { UsersProfileService } from './users-profile.service'
@Module({
  imports: [TypeOrmModule.forFeature([User, CarIternal, PartItem, CarServiceEntity])],
  controllers: [UsersProfileController],
  providers: [UsersProfileService],
})
export class UserProfileModule {}
