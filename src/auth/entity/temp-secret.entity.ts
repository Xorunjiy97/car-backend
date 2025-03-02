import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('temp_secret')
export class TempSecretEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column()
  secret: string;
}
