import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EngineModel } from '../entities/engine.entity';

@Injectable()
export class EngineService {
    constructor(
        @InjectRepository(EngineModel)
        private readonly brandRepository: Repository<EngineModel>,
    ) { }

    async findAll(): Promise<EngineModel[]> {
        return await this.brandRepository.find();
    }

    async create(name: string): Promise<EngineModel> {
        const brand = this.brandRepository.create({ name });
        return await this.brandRepository.save(brand);
    }
}
