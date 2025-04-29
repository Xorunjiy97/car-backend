import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GearModel } from '../entities/gear.entity';

@Injectable()
export class GearService {
    constructor(
        @InjectRepository(GearModel)
        private readonly gearRepository: Repository<GearModel>,
    ) { }

    async findAll(): Promise<GearModel[]> {
        return await this.gearRepository.find({
            where: { deleted: false },
          });
    }

    async create(name: string): Promise<GearModel> {
        const brand = this.gearRepository.create({ name });
        return await this.gearRepository.save(brand);
    }
    async softDeleted(id: number): Promise<void> {
        const model = await this.gearRepository.findOne({ where: { id } });
        if (!model) {
            throw new Error("Model not found")
        }
        model.deleted = true
        this.gearRepository.save(model)

    }
}
