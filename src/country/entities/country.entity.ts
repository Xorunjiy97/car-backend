import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CarBrand } from '../../auto_brand/entities/car-brand.entity';

@Entity('country')
export class CountryModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ default: false })
    deleted: boolean;

}
