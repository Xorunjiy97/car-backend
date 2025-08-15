import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartCategory } from './entities/index';
import { PartCategoryService } from './services/part_category.service';
import { PartCategoryController } from './part_category.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PartCategory])],
    providers: [PartCategoryService],
    controllers: [PartCategoryController],
    exports: [PartCategoryService, TypeOrmModule],
})
export class PartCategoryModule { }
