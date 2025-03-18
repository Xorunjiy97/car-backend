import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CarModel } from '../../auto_model/entities/auto-model.entity';

@Entity('car_brands')
export class CarBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => CarModel, (carModel) => carModel.brand, { eager: false }) // ❌ Убираем авто-загрузку
  models: CarModel[];
}
