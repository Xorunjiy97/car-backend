import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityModel } from '../entities/city.entity';

@Injectable()
export class CityService {
    constructor(
        @InjectRepository(CityModel)
        private readonly cityRepository: Repository<CityModel>,
    ) { }

    async findAll(): Promise<CityModel[]> {
        return await this.cityRepository.find({
            where: { deleted: false },
        });
    }

    async create(name: string): Promise<CityModel> {
        const brand = this.cityRepository.create({ name });
        return await this.cityRepository.save(brand);
    }
    async softDeleted(id: number): Promise<void> {
        const model = await this.cityRepository.findOne({ where: { id } });
        if (!model) {
            throw new Error("cityRepository not found")
        }
        model.deleted = true
        this.cityRepository.save(model)

    }
}
