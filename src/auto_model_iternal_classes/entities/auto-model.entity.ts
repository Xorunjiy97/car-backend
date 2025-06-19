import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CarBrand } from '../../auto_brand/entities/car-brand.entity';
import { CarModelIternar } from 'src/auto_model_iternal/entities';

@Entity('car_models_classes_iternal')
export class CarModelClassesIternal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToOne(() => CarModelIternar, (mc) => mc.models, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'model_class_id' })
    modelClass: CarModelIternar

    @Column({ default: false })
    deleted: boolean;
}
