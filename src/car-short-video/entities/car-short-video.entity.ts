import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    ManyToOne, JoinColumn, RelationId,
    OneToMany
} from 'typeorm';
import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities';
import { CarModelIternar } from 'src/auto_model_iternal/entities';
import { User } from 'src/users/entities/user.entity';
import { CarShortVideoLikeEntity } from './car-short-likes-video.entity';

@Entity('car_short_videos')
export class CarShortVideoEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CarBrandIternal, { nullable: false })
    @JoinColumn({ name: 'brand_id' })
    brand: CarBrandIternal;

    @ManyToOne(() => CarModelIternar, { nullable: false })
    @JoinColumn({ name: 'model_id' })
    model: CarModelIternar;

    @Column({ type: 'text', nullable: false })
    description: string | null;

    @Column({ nullable: false })
    videoUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    moderated: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;

    @Column({ name: 'phone', type: 'varchar', length: 32, nullable: false })
    phone: string


    /** 💡 автоматический FK-идентификатор */
    @RelationId((video: CarShortVideoEntity) => video.createdBy)
    createdById: number;

    @OneToMany(() => CarShortVideoLikeEntity, l => l.video)
    likes: CarShortVideoLikeEntity[]

    // @OneToMany(() => CarShortVideoCommentEntity, c => c.video)
    // comments: CarShortVideoCommentEntity[]
}
