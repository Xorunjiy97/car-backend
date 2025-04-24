import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CarBrand } from '../../auto_brand/entities/car-brand.entity';

@Entity('car_models')
export class CarModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToOne(() => CarBrand, (brand) => brand.models, { onDelete: 'CASCADE' })
    brand: CarBrand;

    @Column({ default: false })
    deleted: boolean;
}
