import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryModel } from '../entities/country.entity';

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(CountryModel)
        private readonly countryRepository: Repository<CountryModel>,
    ) { }

    async findAll(): Promise<CountryModel[]> {
        return await this.countryRepository.find();
    }

    async create(name: string): Promise<CountryModel> {
        const brand = this.countryRepository.create({ name });
        return await this.countryRepository.save(brand);
    }
    async softDeleted(id: number): Promise<void> {
        const model = await this.countryRepository.findOne({ where: { id } });
        if (!model) {
            throw new Error("Model not found")
        }
        model.deleted = true
        this.countryRepository.save(model)

    }
}
