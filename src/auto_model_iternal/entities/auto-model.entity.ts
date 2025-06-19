import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CarBrandIternal } from '../../auta_brands_iternal_cars/entities';
import { CarModelClassesIternal } from '../../auto_model_iternal_classes/entities/index'

@Entity('car_models_iternal')
export class CarModelIternar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToOne(() => CarBrandIternal, (brand) => brand.models, { onDelete: 'CASCADE' })
    brand: CarBrandIternal;

    @Column({ default: false })
    deleted: boolean;

    @OneToMany(() => CarModelClassesIternal, (model) => model.modelClass)
    models: CarModelClassesIternal[]
}
