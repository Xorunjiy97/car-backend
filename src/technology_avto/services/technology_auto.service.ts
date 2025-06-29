import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnologyAutoModel } from '../entities/technology_auto.entity';

@Injectable()
export class MasterTypeService {
    constructor(
        @InjectRepository(TechnologyAutoModel)
        private readonly masterRepository: Repository<TechnologyAutoModel>,
    ) { }

    async findAll(): Promise<TechnologyAutoModel[]> {
        return this.masterRepository.find({
            where: { deleted: false },
        });
    }


    async create(name: string): Promise<TechnologyAutoModel> {
        const brand = this.masterRepository.create({ name });
        return await this.masterRepository.save(brand);
    }
    async softDeleted(id: number): Promise<void> {
        const model = await this.masterRepository.findOne({ where: { id } });
        if (!model) {
            throw new Error("masterRepository not found")
        }
        model.deleted = true
        this.masterRepository.save(model)

    }
}
