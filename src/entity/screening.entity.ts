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

import { Movies } from './movies.entity';
import { Theaters } from './theaters.entity';
import { Reservation } from './reservation.entity';

@Entity({ name: 'screening' })
@Unique(['id'])
export class Screening extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'kind',
    type: 'varchar',
    length: 50,
    default: '00',
    comment: '00: default, 01: moring, 02: night',
  })
  kind: string;

  @Column({
    name: 'start_time',
    type: 'datetime',
    comment: '시작시간',
    default: null,
  })
  start_time: Date | null;

  @Column({
    name: 'end_time',
    type: 'datetime',
    comment: '종료시간',
    default: null,
  })
  end_time: Date | null;

  @Column({
    name: 'ready_time',
    type: 'datetime',
    comment: '준비시간',
    default: null,
  })
  ready_time: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @OneToMany(() => Reservation, (reservation) => reservation.screening_id)
  reservation: Reservation[];

  @ManyToOne(() => Movies, (movie) => movie.id)
  @JoinColumn({ name: 'movie_id' })
  movie_id: Movies;

  @ManyToOne(() => Theaters, (theater) => theater.id)
  @JoinColumn({ name: 'theater_id' })
  theater_id: Theaters;
  screening: Reservation[];
}
