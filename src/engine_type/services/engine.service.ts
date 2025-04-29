import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EngineModel } from '../entities/engine.entity';

@Injectable()
export class EngineService {
    constructor(
        @InjectRepository(EngineModel)
        private readonly engineService: Repository<EngineModel>,
    ) { }

    async findAll(): Promise<EngineModel[]> {
        return await this.engineService.find({
            where: { deleted: false },
          });
    }

    async create(name: string): Promise<EngineModel> {
        const brand = this.engineService.create({ name });
        return await this.engineService.save(brand);
    }
    async softDeleted(id: number): Promise<void> {
        const model = await this.engineService.findOne({ where: { id } });
        if (!model) {
            throw new Error("Model not found")
        }
        model.deleted = true
        this.engineService.save(model)

    }
}
