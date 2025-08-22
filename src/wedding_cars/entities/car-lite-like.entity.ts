// src/cars_iternal/entities/car-like.entity.ts
import {
    Entity, PrimaryGeneratedColumn, CreateDateColumn,
    ManyToOne, JoinColumn, Unique, RelationId,
} from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { CarIternalLite } from './car-internal-lite.entity'

@Entity('car_lite_likes')
@Unique(['car', 'user'])               // один лайк от одного пользователя
export class CarLiteLikeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => CarIternalLite, c => c.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'car_id' })
    car: CarIternalLite

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User

    @RelationId((l: CarLiteLikeEntity) => l.user)
    userId: number

    @CreateDateColumn()
    createdAt: Date
}
