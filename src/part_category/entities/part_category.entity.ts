import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('part_category')
export class PartCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ default: false })
    deleted: boolean;
}
