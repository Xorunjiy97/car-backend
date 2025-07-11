import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    ManyToOne, JoinColumn, RelationId
} from 'typeorm';
import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities';
import { CarModelIternar } from 'src/auto_model_iternal/entities';
import { User } from 'src/users/entities/user.entity';

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

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column()
    videoUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ default: false })
    moderated: boolean;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;

    /** 💡 автоматический FK-идентификатор */
    @RelationId((video: CarShortVideoEntity) => video.createdBy)
    createdById: number;
}
