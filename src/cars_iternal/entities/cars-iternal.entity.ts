import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities';
import { CarModelIternar } from 'src/auto_model_iternal/entities';
import { EngineModel } from 'src/engine_type/entities/engine.entity';
import { CountryManufacturerModel } from 'src/country_manufacturer/entities';
import { BodyModel } from 'src/body_type/entities/body.entity';
import { GearModel } from 'src/gear_box/entities/gear.entity';
import { CityModel } from 'src/city/entities';
import { TechnologyAutoModel } from 'src/technology_avto/entities';

@Entity('cars_iternal')
export class CarIternal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CarBrandIternal, { nullable: false })
  brand: CarBrandIternal;

  @ManyToOne(() => CarModelIternar, { nullable: false })
  model: CarModelIternar;

  @ManyToOne(() => CountryManufacturerModel, { nullable: false })
  country: CountryManufacturerModel;

  @ManyToOne(() => EngineModel, { nullable: false })
  engine_type: EngineModel;

  @ManyToOne(() => CityModel, { nullable: false })
  cityId: CityModel;

  @ManyToOne(() => BodyModel, { nullable: false })
  body_type: BodyModel;

  @ManyToOne(() => TechnologyAutoModel, { nullable: false })
  technology: TechnologyAutoModel;

  @ManyToOne(() => GearModel, { nullable: false })
  gear_box: GearModel;

  @Column({ type: 'int' })
  hp_count: number;

  @Column({ type: 'int' })
  number_of_seats: number;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar' })
  vin_code: string;

  @Column({ default: false, nullable: true })
  credit_posible: boolean;

  @Column({ default: false, nullable: true })
  barter_posible: boolean;

  @Column({ default: false, nullable: true })
  crashed: boolean;

  @Column({ default: false, nullable: true })
  collored: boolean;

  @Column({ default: false, nullable: true })
  needs_renovation: boolean;

  @Column({ type: 'varchar' })
  user_name: string;

  @Column({ type: 'varchar' })
  user_email: string;

  @Column({ type: 'varchar' })
  user_phone: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  mileage: number;

  @Column({ type: 'int' })
  engine_power: number;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text', array: true, nullable: true })
  photos: string[];

  @Column({ type: "varchar", nullable: true })
  avatar: string

  @Column({ nullable: true })
  videoLink: string;

  @Column({ default: false, nullable: true })
  moderated: boolean
}
