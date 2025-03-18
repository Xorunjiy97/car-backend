import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserRoleEnum } from '../../auth/enums/user-role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Должен быть уникальным
  phone: string;
  
  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    enumName: 'UserRoleEnum',
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;
}
