import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('oil_types')
export class OilType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ default: false })
    deleted: boolean;
}
