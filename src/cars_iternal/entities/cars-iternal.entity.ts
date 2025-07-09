import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities';
import { CarModelIternar } from 'src/auto_model_iternal/entities';
import { EngineModel } from 'src/engine_type/entities/engine.entity';
import { CountryManufacturerModel } from 'src/country_manufacturer/entities';
import { BodyModel } from 'src/body_type/entities/body.entity';
import { GearModel } from 'src/gear_box/entities/gear.entity';
import { CityModel } from 'src/city/entities';
import { TechnologyAutoModel } from 'src/technology_avto/entities';
import { User } from 'src/users/entities/user.entity';

@Entity('cars_iternal')
export class CarIternal {
  /* ---------- PK ---------- */
  @PrimaryGeneratedColumn()
  id: number

  /* ---------- scalar ---------- */


  @Column({ name: 'hp_count', type: 'int' })
  hpCount: number

  @Column({ name: 'number_of_seats', type: 'int' })
  numberOfSeats: number

  @Column()
  color: string

  @Column({ name: 'vin_code' })
  vinCode: string

  @Column({ name: 'engine_power', type: 'int' })
  enginePower: number

  @Column({ type: 'int' })
  mileage: number

  @Column({ type: 'int' })
  year: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Column({ name: 'credit_posible', default: false })
  creditPosible: boolean

  @Column({ name: 'barter_posible', default: false })
  barterPosible: boolean

  @Column({ default: false })
  crashed: boolean

  @Column({ name: 'collored', default: false })
  collored: boolean

  @Column({ name: 'needs_renovation', default: false })
  needsRenovation: boolean

  @Column()
  userName: string

  @Column()
  userEmail: string

  @Column()
  userPhone: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'text', array: true, nullable: true })
  photos: string[]

  @Column({ nullable: true })
  avatar: string | null

  @Column({ nullable: true })
  videoLink: string | null

  @Column({ default: false })
  moderated: boolean

  /* ---------- relations ---------- */
  @ManyToOne(() => CarBrandIternal, { nullable: false })
  @JoinColumn({ name: 'brand_id' })
  brand: CarBrandIternal

  @ManyToOne(() => CarModelIternar, { nullable: false })
  @JoinColumn({ name: 'model_id' })
  model: CarModelIternar

  @ManyToOne(() => CountryManufacturerModel, { nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: CountryManufacturerModel

  @ManyToOne(() => EngineModel, { nullable: false })
  @JoinColumn({ name: 'engine_type_id' })
  engineType: EngineModel

  @ManyToOne(() => CityModel, { nullable: false })
  @JoinColumn({ name: 'city_id' })
  city: CityModel

  @ManyToOne(() => BodyModel, { nullable: false })
  @JoinColumn({ name: 'body_type_id' })
  bodyType: BodyModel

  @ManyToMany(() => TechnologyAutoModel)
  @JoinTable({
    name: 'car_technologies',           // уникальное имя таблицы-связки
    joinColumn: {                       // FK на cars_iternal
      name: 'car_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {                // FK на technology_avto
      name: 'technology_id',
      referencedColumnName: 'id',
    },
  })
  technologies: TechnologyAutoModel[]


  @ManyToOne(() => GearModel, { nullable: false })
  @JoinColumn({ name: 'gear_box_id' })
  gearBox: GearModel

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User
}

