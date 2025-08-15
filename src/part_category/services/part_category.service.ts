import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartCategory } from '../entities/part_category.entity';

@Injectable()
export class PartCategoryService {
    constructor(
        @InjectRepository(PartCategory)
        private readonly partCategoryService: Repository<PartCategory>,
    ) { }

    async findAll(): Promise<PartCategory[]> {
        return await this.partCategoryService.find({
            where: { deleted: false },
        });
    }

    async create(name: string): Promise<PartCategory> {
        const brand = this.partCategoryService.create({ name });
        return await this.partCategoryService.save(brand);
    }
    async softDeleted(id: number): Promise<void> {
        const model = await this.partCategoryService.findOne({ where: { id } });
        if (!model) {
            throw new Error("Model not found")
        }
        model.deleted = true
        this.partCategoryService.save(model)

    }
}
