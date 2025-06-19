import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarModelIternar } from '../entities/index';
import { CarBrandIternal } from '../../auta_brands_iternal_cars/entities';
import { CreateCarModelDto } from '../dto/create-car-model.dto';

@Injectable()
export class CarModelService {
    constructor(
        @InjectRepository(CarModelIternar)
        private readonly modelRepository: Repository<CarModelIternar>,
        @InjectRepository(CarBrandIternal)
        private readonly brandRepository: Repository<CarBrandIternal>,
    ) { }

    
    async findAll(): Promise<CarModelIternar[]> {
        return await this.modelRepository.find({
          where: { deleted: false },
          relations: ['models'],
        });
    }
    async softDeleted(id: number): Promise<void> {
        const model = await this.modelRepository.findOne({ where: { id } });
        if (!model) {
            throw new Error("Model not found")
        }
        model.deleted = true
        this.modelRepository.save(model)

    }
    async create(dto: CreateCarModelDto): Promise<CarModelIternar> {
        const brand = await this.brandRepository.findOne({ where: { id: dto.brandId } });
        if (!brand) throw new Error('Brand not found');

        const model = this.modelRepository.create({ name: dto.name, brand });
        return await this.modelRepository.save(model);
    }
}
