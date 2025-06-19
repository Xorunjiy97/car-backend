import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CarModelIternar } from 'src/auto_model_iternal/entities';
@Entity('car_brands_iternal_cars')
export class CarBrandIternal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => CarModelIternar, (carModel) => carModel.brand, { eager: false }) // ❌ Убираем авто-загрузку
  models: CarModelIternar[];

  @Column({ default: false })
  deleted: boolean;
}
