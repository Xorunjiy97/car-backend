// users-profile.service.ts
import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { ListingsResponse, ListingDto } from './dto/user-listings.dto'
import { CarIternal } from 'src/cars_iternal/entities/cars-iternal.entity'
import { User } from 'src/users/entities/user.entity'
import { PartItem } from 'src/parts/entities'
import { CarServiceEntity } from 'src/services_cars/entities'

@Injectable()
export class UsersProfileService {
    constructor(private readonly ds: DataSource) { }

    private parseCursor(cursor?: string) {
        if (!cursor) return null
        const [iso, id] = cursor.split('_')
        return { ts: new Date(iso), id: Number(id) }
    }
    private makeCursor(row: { createdAt: Date; id: number }) {
        return `${row.createdAt.toISOString()}_${row.id}`
    }

    async getSummary(userId: number) {
        const userRepo = this.ds.getRepository(User)
        const user = await userRepo.findOne({
            where: { id: userId },
            select: ['id', 'phone'],
        })
        if (!user) return { user: null, counts: { cars: 0, parts: 0, services: 0 } }

        const [cars, parts, services] = await Promise.all([
            this.ds.getRepository(CarIternal).count({ where: { createdBy: { id: userId }, deleted: false } }),
            this.ds.getRepository(PartItem).count({ where: { createdBy: { id: userId }, deleted: false } }),
            this.ds.getRepository(CarServiceEntity).count({ where: { createdBy: { id: userId } } }),
        ])

        return {
            user: { id: user.id, phone: user.phone },
            counts: { cars, parts, services },
        }
    }

    async getListings(
        userId: number,
        type: 'car' | 'part' | 'service',
        limit = 20,
        cursor?: string,
  ): Promise<ListingsResponse> {
        const cur = this.parseCursor(cursor)
        const take = Math.min(Math.max(limit, 1), 50)

        if (type === 'car') {
            const qb = this.ds.getRepository(CarIternal).createQueryBuilder('c')
                .leftJoinAndSelect('c.brand', 'brand')
                .leftJoinAndSelect('c.model', 'model')
                .leftJoinAndSelect('c.city', 'city')
                .leftJoinAndSelect('c.engineType', 'engine')
                .leftJoinAndSelect('c.bodyType', 'body')
                .leftJoin('c.createdBy', 'u')
                .where('u.id = :userId', { userId })
                .andWhere('c.deleted = false')
                .andWhere('c.moderated = true')


            // ⚠️ НЕ путать: раньше было c.createdBy — это relation, а не дата!
            // Используй createdAt. Если колонки нет — см. комментарий ниже.
            if (cur) {
                qb.andWhere('(c.createdAt < :ts OR (c.createdAt = :ts AND c.id < :id))', { ts: cur.ts, id: cur.id })
            }

            const rows = await qb
                .orderBy('c.createdAt', 'DESC')
                .addOrderBy('c.id', 'DESC')
                .limit(take + 1)
                .getMany()

            // утилита: взять .name или .title, что есть
            const label = (o?: any) => o?.name ?? o?.title ?? ''

            const data: ListingDto[] = rows.slice(0, take).map(r => ({
                id: r.id,
                type: 'car',
                title: `${label(r.brand)} ${label(r.model)}`.trim(),
                price: Number(r.price ?? 0),
                previewUrl: r.avatar ?? (r.photos?.[0] ?? null),
                city: label(r.city) || null,
                status: r.deleted ? 'deleted' : r.moderated ? 'published' : 'draft',
                createdAt: (r as any).createdAt?.toISOString?.() ?? new Date().toISOString(),
                extra: {
                    year: r.year,
                    mileage: r.mileage,
                    engine: label(r.engineType),
                    body: label(r.bodyType),
                },
            }))

            const nextCursor = rows.length > take ? this.makeCursor(rows[take] as any) : null
            return { data, nextCursor }
        }

        if (type === 'part') {
            const qb = this.ds.getRepository(PartItem).createQueryBuilder('p')
                .leftJoinAndSelect('p.brand', 'brand')
                .leftJoinAndSelect('p.model', 'model')
                .leftJoinAndSelect('p.city', 'city')
                .leftJoin('p.createdBy', 'u')
                .where('u.id = :userId', { userId })
                .andWhere('p.deleted = false')
                .andWhere('p.moderated = true')


            if (cur) {
                qb.andWhere('(p.createdAt < :ts OR (p.createdAt = :ts AND p.id < :id))', { ts: cur.ts, id: cur.id })
            }

            const rows = await qb
                .orderBy('p.createdAt', 'DESC')
                .addOrderBy('p.id', 'DESC')
                .limit(take + 1)
                .getMany()

            const label = (o?: any) => o?.name ?? o?.title ?? null

            const data: ListingDto[] = rows.slice(0, take).map(r => ({
                id: r.id,
                type: 'part',
                title: r.title,
                price: r.price ? Number(r.price) : null,
                previewUrl: r.avatar ?? (r.photos?.[0] ?? null),
                city: label(r.city),
                status: r.deleted ? 'deleted' : r.moderated ? 'published' : 'draft',
                createdAt: (r as any).createdAt.toISOString(),
                extra: {
                    brand: label(r.brand),
                    model: label(r.model),
                    isUsed: r.isUsed,
                },
            }))

            const nextCursor = rows.length > take ? this.makeCursor(rows[take] as any) : null
            return { data, nextCursor }
        }

        if (type === 'service') {
            const qb = this.ds.getRepository(CarServiceEntity).createQueryBuilder('s')
                .leftJoinAndSelect('s.city', 'city')
                .leftJoin('s.createdBy', 'u')
                .where('u.id = :userId', { userId })
                .andWhere('s.moderated = true')

            if (cur) {
                qb.andWhere('(s.createdAt < :ts OR (s.createdAt = :ts AND s.id < :id))', { ts: cur.ts, id: cur.id })
            }

            const rows = await qb
                .orderBy('s.createdAt', 'DESC')
                .addOrderBy('s.id', 'DESC')
                .limit(take + 1)
                .getMany()

            const label = (o?: any) => o?.name ?? o?.title ?? null

            const data: ListingDto[] = rows.slice(0, take).map(r => ({
                id: r.id,
                type: 'service',
                title: r.name,
                price: null,
                previewUrl: r.avatar ?? (r.photos?.[0] ?? null),
                city: label(r.city),
                status: r.moderated ? 'published' : 'draft',
                createdAt: (r as any).createdAt.toISOString(),
                extra: { address: r.address, mobile: r.mobile },
            }))

            const nextCursor = rows.length > take ? this.makeCursor(rows[take] as any) : null
            return { data, nextCursor }
        }

        return { data: [], nextCursor: null }
    }
}
