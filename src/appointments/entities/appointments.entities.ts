import { CarServiceEntity } from "src/services_cars/entities"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string // Имя клиента

    @Column()
    car: string // Название машины

    @Column()
    plateNumber: string // Номер машины

    @Column({ type: 'text' })
    description: string // Описание работ

    @Column({ nullable: true })
    phoneNumber: string

    @Column()
    date: string // '2025-08-01'

    @Column()
    time: string // '10:30'

    @Column({ default: 'waiting' })
    status: 'waiting' | 'arrived' | 'late' | 'cancelled'

    @ManyToOne(() => CarServiceEntity, (service) => service.appointments)
    service: CarServiceEntity
}
