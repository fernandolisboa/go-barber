import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'

import User from '@modules/users/infra/typeorm/entities/User'

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  provider_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User

  @Column()
  customer_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User

  @Column('time with time zone')
  date: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

export default Appointment
