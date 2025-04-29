import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { CarBrand } from '../../auto_brand/entities/car-brand.entity';
import { CountryModel } from '../../country/entities/country.entity';
import { MasterModel } from '../../master_type/entities/master_type.entity';

@Entity('car_services')
export class CarServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToOne(() => CountryModel)
    @JoinColumn({ name: 'city_id' })
    city: CountryModel;

    @ManyToMany(() => CarBrand)
    @JoinTable({ name: 'car_service_brands' })
    brands: CarBrand[];

    @ManyToMany(() => MasterModel)
    @JoinTable({ name: 'car_service_master_types' })
    masterTypes: MasterModel[];

    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'varchar', length: 255 })
    mobile: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    whatsapp: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    telegram: string;

    @Column({ nullable: true })
    videoLink: string;

    @Column({ type: 'text', array: true, nullable: true })
    photos: string[];

    @Column({ type: 'varchar', nullable: true })
    avatar: string;
}
