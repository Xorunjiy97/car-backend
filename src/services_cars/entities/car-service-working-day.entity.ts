import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { CarServiceEntity } from '.'

@Entity('car_service_working_days')
export class CarServiceWorkingDay {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    dayOfWeek: number // 0 = воскресенье, 1 = понедельник и т.д.

    @ManyToOne(() => CarServiceEntity, (service) => service.workingDays, {
        onDelete: 'CASCADE',
    })
    service: CarServiceEntity
}
