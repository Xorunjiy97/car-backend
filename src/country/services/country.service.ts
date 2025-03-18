import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryModel } from '../entities/country.entity';

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(CountryModel)
        private readonly brandRepository: Repository<CountryModel>,
    ) { }

    async findAll(): Promise<CountryModel[]> {
        return await this.brandRepository.find();
    }

    async create(name: string): Promise<CountryModel> {
        const brand = this.brandRepository.create({ name });
        return await this.brandRepository.save(brand);
    }
}
