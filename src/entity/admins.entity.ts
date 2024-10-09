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

@Entity({ name: 'admins' })
@Unique(['id', 'account_name'])
export class Admins extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    comment: '관리자 명',
  })
  name: string;

  @Column({
    unique: true,
    name: 'account_name',
    type: 'varchar',
    length: 50,
    comment: '관리자 계정 명',
  })
  account_name: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    comment: '비밀번호',
  })
  password: string;

  @Column({
    name: 'class',
    type: 'varchar',
    length: 50,
    default: '00',
    comment: '관리자 등급',
  })
  class: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;
}
