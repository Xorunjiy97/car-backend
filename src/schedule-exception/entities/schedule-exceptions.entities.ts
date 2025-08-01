import { CarServiceEntity } from "src/services_cars/entities"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity('schedule_exceptions')
export class ScheduleException {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    date: string // '2025-08-02'

    @Column({ nullable: true })
    time?: string // '10:30' если закрыто только время

    @Column({ default: true })
    isClosed: boolean

    @ManyToOne(() => CarServiceEntity, (service) => service.exceptions, {
        onDelete: 'CASCADE',
    })
    service: CarServiceEntity
}
