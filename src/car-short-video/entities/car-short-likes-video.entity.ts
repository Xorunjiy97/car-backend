import {
    Entity, PrimaryGeneratedColumn, CreateDateColumn,
    ManyToOne, JoinColumn, Unique, RelationId
} from 'typeorm'
import { CarShortVideoEntity } from './car-short-video.entity'
import { User } from 'src/users/entities/user.entity'

@Entity('car_short_video_likes')
@Unique(['video', 'user'])           // 👈  один лайк от одного юзера
export class CarShortVideoLikeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => CarShortVideoEntity, v => v.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'video_id' })
    video: CarShortVideoEntity

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User

    @RelationId((like: CarShortVideoLikeEntity) => like.user)
    userId: number

    @CreateDateColumn()
    createdAt: Date
}
