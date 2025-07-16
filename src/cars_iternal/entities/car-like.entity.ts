// src/cars_iternal/entities/car-like.entity.ts
import {
    Entity, PrimaryGeneratedColumn, CreateDateColumn,
    ManyToOne, JoinColumn, Unique, RelationId,
} from 'typeorm'
import { CarIternal } from './cars-iternal.entity'
import { User } from 'src/users/entities/user.entity'

@Entity('car_likes')
@Unique(['car', 'user'])               // один лайк от одного пользователя
export class CarLikeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => CarIternal, c => c.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'car_id' })
    car: CarIternal

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User

    @RelationId((l: CarLikeEntity) => l.user)
    userId: number

    @CreateDateColumn()
    createdAt: Date
}
