import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBrandIternal } from '../entities/car-brand.entity';
import { CarModelIternar } from 'src/auto_model_iternal/entities';



@Injectable()
export class CarBrandService {
  constructor(
    @InjectRepository(CarBrandIternal)
    private readonly brandRepository: Repository<CarBrandIternal>,
    @InjectRepository(CarModelIternar)
    private readonly modelRepository: Repository<CarModelIternar>,
  ) { }

  async findAll(): Promise<CarBrandIternal[]> {
    return await this.brandRepository.find({
      where: { deleted: false },
      relations: ['models', 'models.models'],
    });
  }

  async findModelsByBrand(brandId: number): Promise<CarModelIternar[]> {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId, deleted: false },
      relations: ['models', 'models.models'],
    })
    if (!brand) {
      throw new NotFoundException(`Brand with id ${brandId} not found`)
    }

    const result = []
    for (const model of brand.models) {
      if (model.models && model.models.length > 0) {
        result.push(...model.models)
      } else {
        result.push(model)
      }
    }
    return result
  }

  async create(name: string): Promise<CarBrandIternal> {
    const brand = this.brandRepository.create({ name });
    return await this.brandRepository.save(brand);
  }
  async softDelete(id: number): Promise<void> {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['models'],
    });

    if (!brand) throw new Error('Car brand not found');

    if (brand.models && brand.models.length > 0) {
      for (const model of brand.models) {
        model.deleted = true;
        await this.modelRepository.save(model);
      }
    }


    await this.brandRepository.remove(brand);
  }

}
