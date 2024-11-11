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

@Entity({ name: 'movies' })
@Unique(['id'])
export class Movies extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 50,
    comment: '고객 명',
  })
  title: string;

  @Column({
    name: 'genre',
    type: 'varchar',
    length: 255,
    comment: '장르',
  })
  genre: string;

  @Column({
    name: 'deliberation',
    type: 'varchar',
    length: 50,
    default: '00',
    comment: '심의(00:all, 10: 12세, 20: 15세, 30: 19세)',
  })
  deliberation: string;

  @Column({
    name: 'price',
    type: 'int',
    default: 0,
    comment: '가격',
  })
  price: number;

  @Column({
    name: 'showtime',
    type: 'int',
    default: 0,
    comment: '상영시간(분)',
  })
  showtime: number;

  @Column({
    name: 'img_url',
    type: 'varchar',
    length: 5000,
    comment: '이미지 url',
  })
  img_url: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 50,
    default: '00',
    comment: '상태값(00:상영중, 10: 예매중, 20: 종영)',
  })
  status: string;

  @Column({
    name: 'open_date',
    type: 'datetime',
    comment: '개봉일',
    default: null,
  })
  open_date: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  @OneToMany(() => Screening, (screening) => screening.movie_id)
  screening: Screening[];
}
