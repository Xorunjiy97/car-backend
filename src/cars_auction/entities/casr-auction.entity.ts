import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CarBrand } from '../../auto_brand/entities/car-brand.entity';
import { CarModel } from '../../auto_model/entities/auto-model.entity';
import { EngineModel } from '../../engine_type/entities/engine.entity';
import { CountryModel } from '../../country/entities/country.entity';
import { BodyModel } from '../../body_type/entities/body.entity';
import { GearModel } from '../../gear_box/entities/gear.entity';


@Entity('cars_auction')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => CarBrand, { nullable: false })
  brand: CarBrand;

  @ManyToOne(() => CarModel, { nullable: false })
  model: CarModel;

  @ManyToOne(() => CountryModel, { nullable: false })
  country: CountryModel;
  
  @ManyToOne(() => EngineModel, { nullable: false })
  engine_type: EngineModel;

  @ManyToOne(() => BodyModel, { nullable: false })
  body_type: BodyModel;

  @ManyToOne(() => GearModel, { nullable: false })
  gear_box: GearModel;

  @Column({ type: 'int' })
  hp_count: number;
  
  @Column({ type: 'varchar' })
  drive_train: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceFrom: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceTo: number;

  @Column({ type: 'int' })
  mileage: number;

  @Column({ type: 'int' })
  engine_power: number;

  @Column({ type: 'date' })
  auctionStartDate: Date;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text', array: true, nullable: true }) // Хранение URL фотографий в массиве
  photos: string[];

  @Column({type:"varchar",nullable:true})
  avatar:string
}
