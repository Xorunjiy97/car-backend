import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'
import { User } from 'src/users/entities/user.entity'
import { CarBrandIternal } from 'src/auta_brands_iternal_cars/entities'
import { CarModelIternar } from 'src/auto_model_iternal/entities'
import { CityModel } from 'src/city/entities'
import { PartCategory } from 'src/part_category/entities'

@Entity('part_items')
export class PartItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  title: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ type: 'text', array: true, nullable: true })
  photos?: string[]

  @Column({ default: false })
  isUsed: boolean

  @Column({ default: false })
  moderated: boolean

  @Column({ default: false })
  deleted: boolean

  /* relations */
  @ManyToOne(() => PartCategory, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: PartCategory

  @ManyToOne(() => CarBrandIternal, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand?: CarBrandIternal

  @ManyToOne(() => CarModelIternar, { nullable: true })
  @JoinColumn({ name: 'model_id' })
  model?: CarModelIternar

  @ManyToOne(() => CityModel, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city?: CityModel

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User

  @Column({ nullable: true })
  sellerName?: string

  @Column({ nullable: true })
  sellerPhone?: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
