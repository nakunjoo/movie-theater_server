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

import { Theaters } from './theaters.entity';

@Entity({ name: 'seats' })
@Unique(['id'])
export class Seats extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'line',
    type: 'varchar',
    length: 50,
    comment: '좌석 열',
  })
  line: string;

  @Column({
    name: 'rows',
    type: 'varchar',
    length: 50,
    comment: '좌석 행',
  })
  rows: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @ManyToOne(() => Theaters, (theater) => theater.id)
  @JoinColumn({ name: 'theater_id' })
  theater_id: Theaters;
}
