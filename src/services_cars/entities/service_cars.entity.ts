import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
} from 'typeorm';
import { CarBrand } from '../../auto_brand/entities/car-brand.entity';
import { CityModel } from '../../city/entities/city.entity';
import { MasterModel } from '../../master_type/entities/master_type.entity';
import { User } from 'src/users/entities/user.entity';
import { Appointment } from 'src/appointments/entities';
import { ScheduleException } from 'src/schedule-exception/entities/schedule-exceptions.entities';
import { CarServiceWorkingDay } from './car-service-working-day.entity';

@Entity('car_services')
export class CarServiceEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToOne(() => CityModel)
    @JoinColumn({ name: 'city_id' })
    city: CityModel;

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

    @Column({ type: 'varchar', length: 255, nullable: true })
    instagram: string;

    @Column({ nullable: true })
    videoLink: string;

    @Column({ default: false, nullable: true })
    moderated: boolean

    @Column({ type: 'text', array: true, nullable: true })
    photos: string[];

    @Column({ type: 'varchar', nullable: true })
    avatar: string;
    @OneToMany(() => CarServiceWorkingDay, (wd) => wd.service, { cascade: true })
    workingDays: CarServiceWorkingDay[]

    @OneToMany(() => Appointment, (appointment) => appointment.service)
    appointments: Appointment[]

    @OneToMany(() => ScheduleException, (ex) => ex.service)
    exceptions: ScheduleException[]

    @ManyToOne(() => User, { eager: false })
    @JoinColumn({ name: 'created_by' })
    createdBy: User; // <<< Поле кто создал
}
