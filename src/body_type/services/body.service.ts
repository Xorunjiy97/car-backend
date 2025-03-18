import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BodyModel } from '../entities/body.entity';

@Injectable()
export class BodyService {
    constructor(
        @InjectRepository(BodyModel)
        private readonly brandRepository: Repository<BodyModel>,
    ) { }

    async findAll(): Promise<BodyModel[]> {
        return await this.brandRepository.find();
    }

    async create(name: string): Promise<BodyModel> {
        const brand = this.brandRepository.create({ name });
        return await this.brandRepository.save(brand);
    }
}
