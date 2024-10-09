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

import { Reservation } from './reservation.entity';

@Entity({ name: 'customers' })
@Unique(['id'])
export class Customers extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    comment: '고객 명',
  })
  name: string;

  @Column({
    name: 'nickname',
    type: 'varchar',
    length: 50,
    comment: '고객 별명',
  })
  nickname: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 50,
    comment: '고객번호',
  })
  phone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @OneToMany(() => Reservation, (reservation) => reservation.screening_id)
  reservation: Reservation;
}
