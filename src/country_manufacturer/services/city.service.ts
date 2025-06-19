import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryManufacturerModel } from '../entities/country_manufacturer.entity';

@Injectable()
export class CountryManufacturerService {
    constructor(
        @InjectRepository(CountryManufacturerModel)
        private readonly cityRepository: Repository<CountryManufacturerModel>,
    ) { }

    async findAll(): Promise<CountryManufacturerModel[]> {
        return await this.cityRepository.find({
            where: { deleted: false },
        });
    }

    async create(name: string): Promise<CountryManufacturerModel> {
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
