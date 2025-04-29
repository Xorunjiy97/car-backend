import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BodyModel } from '../entities/body.entity';

@Injectable()
export class BodyService {
    constructor(
        @InjectRepository(BodyModel)
        private readonly bodyRepository: Repository<BodyModel>,
    ) { }

    async findAll(): Promise<BodyModel[]> {
        return await this.bodyRepository.find({
            where: { deleted: false },
          });
    }

    async create(name: string): Promise<BodyModel> {
        const brand = this.bodyRepository.create({ name });
        return await this.bodyRepository.save(brand);
    }
    async softDeleted(id: number): Promise<void> {
        const body = await this.bodyRepository.findOne({ where: { id } });
        if (!body) {
            throw new Error("Model not found")
        }
        body.deleted = true
        this.bodyRepository.save(body)

    }
}
