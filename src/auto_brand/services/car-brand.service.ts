import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBrand } from '../entities/car-brand.entity';

@Injectable()
export class CarBrandService {
    constructor(
        @InjectRepository(CarBrand)
        private readonly brandRepository: Repository<CarBrand>,
    ) { }

    async findAll(): Promise<CarBrand[]> {
        return await this.brandRepository.find({ relations: ['models'] });
    }

    async create(name: string): Promise<CarBrand> {
        const brand = this.brandRepository.create({ name });
        return await this.brandRepository.save(brand);
    }
}
