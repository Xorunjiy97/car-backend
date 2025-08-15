import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PartItem } from './entities/part-item.entity'
import { PartItemsService } from './services/part-items.service'
import { PartItemsController } from './part-items.controller'

@Module({
    imports: [TypeOrmModule.forFeature([PartItem])],
    controllers: [PartItemsController],
    providers: [PartItemsService],
    exports: [TypeOrmModule],
})
export class PartItemsModule { }
