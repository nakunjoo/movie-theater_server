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

import { Seats } from './seats.entity';
import { Screening } from './screening.entity';

@Entity({ name: 'theaters' })
@Unique(['id'])
export class Theaters extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    comment: '상영관 이름',
  })
  name: string;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 50,
    default: '00',
    comment: '극장 타입(00: 2D, 10: 3D, 20: 4D, 30: IMAX)',
  })
  type: string;

  @Column({
    name: 'nubmer_seats',
    type: 'int',
    default: 0,
    comment: '좌석수',
  })
  nubmer_seats: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @OneToMany(() => Seats, (seat) => seat.theater_id)
  seat: Seats;

  @OneToMany(() => Screening, (screening) => screening.theater_id)
  screening: Screening;
}
