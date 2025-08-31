// src/cars_lite/entities/car-internal-lite.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
  ManyToMany, JoinTable, OneToMany, CreateDateColumn
} from 'typeorm'
import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities'
import { CarModelIternar } from 'src/auto_model_iternal/entities'
import { EngineModel } from 'src/engine_type/entities/engine.entity'
import { CityModel } from 'src/city/entities'
import { GearModel } from 'src/gear_box/entities/gear.entity'
import { User } from 'src/users/entities/user.entity'
import { DriverOption } from '../enums/driver-option.enum'
import { CarLiteLikeEntity } from './car-lite-like.entity'

@Entity('rent_cars')
export class CarIternalLite {
  @PrimaryGeneratedColumn()
  id: number

  /* Сохраняем базовые характеристики */
  @Column({ name: 'hp_count', type: 'int' })
  hpCount: number

  @Column({ name: 'number_of_seats', type: 'int' })
  numberOfSeats: number

  @Column({ name: 'engine_power', type: 'int' })
  enginePower: number

  @Column({ type: 'int' })
  year: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  /* Новый признак "водитель" */


  /* Контакты и описание */
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

  /* Связи */
  @ManyToOne(() => CarBrandIternal, { nullable: false })
  @JoinColumn({ name: 'brand_id' })
  brand: CarBrandIternal

  @ManyToOne(() => CarModelIternar, { nullable: false })
  @JoinColumn({ name: 'model_id' })
  model: CarModelIternar

  @ManyToOne(() => EngineModel, { nullable: false })
  @JoinColumn({ name: 'engine_type_id' })
  engineType: EngineModel

  @ManyToOne(() => CityModel, { nullable: false })
  @JoinColumn({ name: 'city_id' })
  city: CityModel



  @ManyToOne(() => GearModel, { nullable: false })
  @JoinColumn({ name: 'gear_box_id' })
  gearBox: GearModel

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ default: false })
  deleted: boolean

  @OneToMany(() => CarLiteLikeEntity, l => l.car)
  likes: CarLiteLikeEntity[]

  /** опциональные виртуальные поля */
  likesCount?: number
  isLiked?: boolean
}
