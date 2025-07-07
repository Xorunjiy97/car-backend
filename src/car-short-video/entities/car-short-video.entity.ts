import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('car_short_videos')
export class CarShortVideoEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    brand: string

    @Column()
    model: string

    @Column({ nullable: true })
    description: string

    @Column()
    videoUrl: string

    @CreateDateColumn()
    createdAt: Date

    @Column({ default: false, nullable: true })
    moderated: boolean
}
