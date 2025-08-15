import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OilType } from '../entities/oil_types.entity';

@Injectable()
export class OilTypeService {
    constructor(
        @InjectRepository(OilType)
        private readonly oilService: Repository<OilType>,
    ) { }

    async findAll(): Promise<OilType[]> {
        return await this.oilService.find({
            where: { deleted: false },
        });
    }

    async create(name: string): Promise<OilType> {
        const brand = this.oilService.create({ name });
        return await this.oilService.save(brand);
    }
    async softDeleted(id: number): Promise<void> {
        const model = await this.oilService.findOne({ where: { id } });
        if (!model) {
            throw new Error("Model not found")
        }
        model.deleted = true
        this.oilService.save(model)

    }
}
