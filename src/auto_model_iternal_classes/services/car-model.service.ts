// src/auto_model_internal/services/car-model-internal.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CarModelClassesIternal } from '../entities/auto-model.entity'
import { CarModelIternar } from 'src/auto_model_iternal/entities'
import { CreateCarModelDto } from '../dto/create-car-model.dto'

@Injectable()
export class CarModelClassInternaService {
    constructor(
        @InjectRepository(CarModelClassesIternal)
        private readonly modelRepo: Repository<CarModelClassesIternal>,

        @InjectRepository(CarModelIternar)
        private readonly classRepo: Repository<CarModelIternar>,
    ) { }

    async findAll(classId?: number): Promise<CarModelClassesIternal[]> {
        const where: any = { deleted: false }
        if (classId) where.modelClass = { id: classId }

        return this.modelRepo.find({
            where,
            relations: ['modelClass'],
        })
    }

    async softDelete(id: number): Promise<void> {
        const model = await this.modelRepo.findOne({ where: { id } })
        if (!model) throw new NotFoundException('Model not found')
        model.deleted = true
        await this.modelRepo.save(model)
    }

    async create(dto: CreateCarModelDto): Promise<CarModelClassesIternal> {
        // DTO: { name: string; modelClassId: number }
        const modelClass = await this.classRepo.findOne({
            where: { id: dto.modelId },
        })
        if (!modelClass) throw new NotFoundException('Model class not found')

        const model = this.modelRepo.create({
            name: dto.name,
            modelClass,
        })
        return this.modelRepo.save(model)
    }
}
