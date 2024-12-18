import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
  BeforeInsert,
  OneToOne,
} from 'typeorm';

import { Screening } from './screening.entity';

@Entity({ name: 'reservation' })
@Unique(['id'])
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'seat',
    type: 'varchar',
    length: 1000,
    comment: '좌석',
  })
  seat: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 50,
    comment: '00: 예매완료, 10: 무통장입금, 20: 취소, 30: 환불, 40: 임시',
  })
  status: string;

  @Column({
    name: 'amount',
    type: 'int',
    default: 0,
    comment: '예매수',
  })
  amount: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    comment: '비회원고객명',
  })
  name: string | null;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 50,
    comment: '비회원고객번호',
  })
  phone: string | null;

  @Column({
    name: 'payment_price',
    type: 'int',
    default: 0,
    comment: '결제금액',
  })
  payment_price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @ManyToOne(() => Screening, (screening) => screening.id)
  @JoinColumn({ name: 'screening_id' })
  screening_id: Screening;
}
