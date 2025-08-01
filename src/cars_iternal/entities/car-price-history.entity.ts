import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { CarIternal } from './cars-iternal.entity'

export type PriceChangeType = 'increase' | 'decrease' | 'same'

@Entity('car_price_history')
export class CarPriceHistory {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => CarIternal, (car) => car.priceHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car: CarIternal

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @Column({ type: 'varchar' })
  changeType: PriceChangeType

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date
}
