import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GearModel } from '../entities/gear.entity';

@Injectable()
export class GearService {
    constructor(
        @InjectRepository(GearModel)
        private readonly brandRepository: Repository<GearModel>,
    ) { }

    async findAll(): Promise<GearModel[]> {
        return await this.brandRepository.find();
    }

    async create(name: string): Promise<GearModel> {
        const brand = this.brandRepository.create({ name });
        return await this.brandRepository.save(brand);
    }
}
