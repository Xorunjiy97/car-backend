import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PartItem } from '../entities/part-item.entity'
import { CreatePartItemDto } from '../dto/create-part-item.dto'
import { UpdatePartItemDto } from '../dto/update-part-item.dto'
import { QueryPartItemDto } from '../dto/query-part-item.dto'

@Injectable()
export class PartItemsService {
    constructor(
        @InjectRepository(PartItem)
        private readonly repo: Repository<PartItem>,
    ) { }

    async create(
        dto: CreatePartItemDto,
        avatarFile: Express.Multer.File | undefined,
        files: Express.Multer.File[] | undefined,
        user: { id: number },
    ) {
        // тут можешь сохранить файлы и получить их пути
        const avatarUrl = avatarFile ? `/uploads/parts/${avatarFile.filename}` : null
        const photoUrls = Array.isArray(files) ? files.map(f => `/uploads/parts/${f.filename}`) : []

        const entity = this.repo.create({
            title: dto.title,
            description: dto.description,
            isUsed: dto.isUsed ?? false,
            category: { id: dto.category_id } as any,
            brand: dto.brand_id ? ({ id: dto.brand_id } as any) : undefined,
            model: dto.model_id ? ({ id: dto.model_id } as any) : undefined,
            city: dto.city_id ? ({ id: dto.city_id } as any) : undefined,
            createdBy: { id: user.id } as any,
            avatar: avatarUrl,
            photos: photoUrls.length ? photoUrls : null,
            moderated: false,
            sellerName: dto.sellerName,
            sellerPhone: dto.sellerPhone,
            deleted: false,
        })

        const saved = await this.repo.save(entity)
        return this.findOne(saved.id)
    }
    async findAll(q: QueryPartItemDto) {
        const page = q.page ?? 1
        const limit = q.limit ?? 20
        const qb = this.repo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.category', 'category')
            .leftJoinAndSelect('p.brand', 'brand')
            .leftJoinAndSelect('p.model', 'model')
            .leftJoinAndSelect('p.city', 'city')
            .leftJoinAndSelect('p.createdBy', 'createdBy')
            .where('p.deleted = :deleted', { deleted: false })
            .andWhere('p.moderated = :moderated', { moderated: true })

        if (q.q) {
            qb.andWhere('(p.title ILIKE :q OR p.description ILIKE :q)', { q: `%${q.q}%` })
        }
        if (q.category_id) qb.andWhere('category.id = :category_id', { category_id: q.category_id })
        if (q.brand_id) qb.andWhere('brand.id = :brand_id', { brand_id: q.brand_id })
        if (q.model_id) qb.andWhere('model.id = :model_id', { model_id: q.model_id })
        if (q.city_id) qb.andWhere('city.id = :city_id', { city_id: q.city_id })
        if (q.isUsed === 'true') qb.andWhere('p.isUsed = TRUE')
        if (q.isUsed === 'false') qb.andWhere('p.isUsed = FALSE')

        qb.orderBy('p.createdAt', 'DESC')
        qb.skip((page - 1) * limit).take(limit)

        const [items, total] = await qb.getManyAndCount()
        return {
            items,
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        }
    }
    async findAllNoModerated(q: QueryPartItemDto) {
        const page = q.page ?? 1
        const limit = q.limit ?? 20
        const qb = this.repo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.category', 'category')
            .leftJoinAndSelect('p.brand', 'brand')
            .leftJoinAndSelect('p.model', 'model')
            .leftJoinAndSelect('p.city', 'city')
            .leftJoinAndSelect('p.createdBy', 'createdBy')
            .where('p.deleted = :deleted', { deleted: false })
            .andWhere('p.moderated = :moderated', { moderated: false })

        if (q.q) {
            qb.andWhere('(p.title ILIKE :q OR p.description ILIKE :q)', { q: `%${q.q}%` })
        }
        if (q.category_id) qb.andWhere('category.id = :category_id', { category_id: q.category_id })
        if (q.brand_id) qb.andWhere('brand.id = :brand_id', { brand_id: q.brand_id })
        if (q.model_id) qb.andWhere('model.id = :model_id', { model_id: q.model_id })
        if (q.city_id) qb.andWhere('city.id = :city_id', { city_id: q.city_id })
        if (q.isUsed === 'true') qb.andWhere('p.isUsed = TRUE')
        if (q.isUsed === 'false') qb.andWhere('p.isUsed = FALSE')

        qb.orderBy('p.createdAt', 'DESC')
        qb.skip((page - 1) * limit).take(limit)

        const [items, total] = await qb.getManyAndCount()
        return {
            items,
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        }
    }
    findOne(id: number) {
        return this.repo.findOne({
            where: { id, deleted: false },
            relations: ['category', 'brand', 'model', 'city', 'createdBy'],
        })
    }

    async update(
        id: number,
        dto: UpdatePartItemDto,
        avatarFile?: Express.Multer.File,
        newPhotoFiles?: Express.Multer.File[],
    ) {
        const part = await this.repo.findOne({
            where: { id },
            relations: { category: true, brand: true, model: true, city: true, createdBy: true },
        })
        if (!part) throw new NotFoundException('Part not found')

        // примитивы
        if (dto.title !== undefined) part.title = dto.title
        if (dto.description !== undefined) part.description = dto.description
        if (dto.isUsed !== undefined) part.isUsed = dto.isUsed
        if (dto.sellerName !== undefined) part.sellerName = dto.sellerName
        if (dto.sellerPhone !== undefined) part.sellerPhone = dto.sellerPhone

        // связи (как в create)
        if (dto.category_id !== undefined) part.category = { id: dto.category_id } as any
        if (dto.brand_id !== undefined) part.brand = dto.brand_id ? ({ id: dto.brand_id } as any) : undefined
        if (dto.model_id !== undefined) part.model = dto.model_id ? ({ id: dto.model_id } as any) : undefined
        if (dto.city_id !== undefined) part.city = dto.city_id ? ({ id: dto.city_id } as any) : undefined

        // медиа: удалить/заменить avatar
        if (dto.removeAvatar) part.avatar = null
        if (avatarFile) part.avatar = `/uploads/parts/${avatarFile.filename}`

        // медиа: удалить выбранные старые фото + добавить новые
        const current = Array.isArray(part.photos) ? part.photos : []
        let next = current

        if (dto.removePhotos?.length) {
            const toRemove = new Set(dto.removePhotos)
            next = next.filter(p => !toRemove.has(p))
        }

        if (newPhotoFiles?.length) {
            const add = newPhotoFiles.map(f => `/uploads/parts/${f.filename}`)
            next = [...next, ...add]
        }

        part.photos = next.length ? next : null

        await this.repo.save(part)

        // вернуть свежие relations
        return this.repo.findOne({
            where: { id: part.id },
            relations: { category: true, brand: true, model: true, city: true, createdBy: true },
        })
    }
    async softDelete(id: number) {
        await this.repo.update(id, { deleted: true })
        return { id, deleted: true }
    }

    async moderate(id: number) {
        await this.repo.update(id, { moderated: true })
        return this.findOne(id)
    }
}
