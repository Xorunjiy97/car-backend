import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarModel } from '../entities/index';
import { CarBrand } from '../../auto_brand/entities/index';
import { CreateCarModelDto } from '../dto/create-car-model.dto';

@Injectable()
export class CarModelService {
    constructor(
        @InjectRepository(CarModel)
        private readonly modelRepository: Repository<CarModel>,
        @InjectRepository(CarBrand)
        private readonly brandRepository: Repository<CarBrand>,
    ) { }

    async findAll(brandId?: number): Promise<CarModel[]> {
        const whereCondition = brandId ? { where: { brand: { id: brandId } } } : {};

        return await this.modelRepository.find({
            ...whereCondition,
            relations: [],
        });
    }

    async create(dto: CreateCarModelDto): Promise<CarModel> {
        const brand = await this.brandRepository.findOne({ where: { id: dto.brandId } });
        if (!brand) throw new Error('Brand not found');

        const model = this.modelRepository.create({ name: dto.name, brand });
        return await this.modelRepository.save(model);
    }
}
