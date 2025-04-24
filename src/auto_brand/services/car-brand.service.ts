import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBrand } from '../entities/car-brand.entity';
import { CarModel } from '../../auto_model/entities/index';



@Injectable()
export class CarBrandService {
    constructor(
        @InjectRepository(CarBrand)
        private readonly brandRepository: Repository<CarBrand>,
        // private readonly modelRepository: Repository<CarModel>,
    ) { }

    async findAll(): Promise<CarBrand[]> {
        return await this.brandRepository.find({ relations: ['models'] });
    }

    async create(name: string): Promise<CarBrand> {
        const brand = this.brandRepository.create({ name });
        return await this.brandRepository.save(brand);
    }
    async softDelete(id: number): Promise<void> {
        // const brand = await this.brandRepository.findOne({
        //     where: { id },
        //     relations: ['models'],
        // });

        // if (!brand) throw new Error('Car brand not found');

        // if (brand.models && brand.models.length > 0) {
        //     for (const model of brand.models) {
        //         model.deleted = true;
        //         await this.modelRepository.save(model);
        //     }
        // }


        // await this.brandRepository.remove(brand);
    }

}
