import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { CarServiceEntity } from './service_cars.entity'

@Entity('car_service_working_days')
export class CarServiceWorkingDay {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    dayOfWeek: number // 0 = вс, 1 = пн, ...

    @Column({ type: 'time', nullable: true })
    startTime: string // '09:00'

    @Column({ type: 'time', nullable: true })
    endTime: string // '18:00'

    @ManyToOne(() => CarServiceEntity, (service) => service.workingDays, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'car_service_id' })
    service: CarServiceEntity
}