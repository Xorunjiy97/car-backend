import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterModel } from '../entities/master_type.entity';

@Injectable()
export class MasterTypeService {
    constructor(
        @InjectRepository(MasterModel)
        private readonly masterRepository: Repository<MasterModel>,
    ) { }

    async findAll(): Promise<MasterModel[]> {
        return await this.masterRepository.find();
    }

    async create(name: string): Promise<MasterModel> {
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
