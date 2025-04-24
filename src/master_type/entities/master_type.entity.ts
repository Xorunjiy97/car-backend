import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('master_type')
export class MasterModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ default: false })
    deleted: boolean;
}
