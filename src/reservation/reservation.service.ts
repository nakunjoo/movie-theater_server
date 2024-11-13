import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorException } from 'src/utils/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Not, Like, Between } from 'typeorm';
import * as fs from 'fs';
import dayjs from 'src/utils/dayjs';

// repository
import { ReservationRepository } from 'src/repository/reservation.repository';

// entity
import { Reservation } from 'src/entity/reservation.entity';

import { ReservationCreateDto } from './dto/reservation_create.dto';
import { Screening } from 'src/entity/screening.entity';

@Injectable()
export class ReservationService {
  private url_path: string;
  constructor(
    private readonly dataSource: DataSource,
    private readonly reservationRepository: ReservationRepository,
  ) {
    this.url_path = `https://storage.cloud.google.com/teak-banner-431004-n3.appspot.com/`;
  }

  /**
   * @description 영화 예매 등록
   *
   * @param screening_id 상영 영화 고유 아이디
   * @param seat 선택 좌석
   * @param amount 예매 수
   * @param name 예매자 명
   * @param phone 예매자 번호
   * @param payment_price 총 결제금액
   */
  async createReservation(reservation_info: ReservationCreateDto) {
    // transaction 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let overlapCheck = false;
      const screening = await queryRunner.manager.findOne(Screening, {
        where: {
          id: reservation_info.screening_id,
        },
      });
      if (!screening) {
        ErrorException(
          HttpStatus.NOT_FOUND,
          '상영 영화가 존재하지 않습니다.',
          404,
        );
      }
      for (const seat of reservation_info.seat) {
        const findSeat = await queryRunner.manager.findOne(Reservation, {
          where: {
            screening_id: screening,
            seat: Like(`%${seat}%`),
            status: Not('20'),
          },
        });
        if (findSeat) {
          overlapCheck = true;
        }
      }

      if (overlapCheck) {
        ErrorException(HttpStatus.NOT_FOUND, '이미 예매된 좌석입니다.', 404);
      }
      const create_reservation = this.reservationRepository.create({
        screening_id: screening,
        seat: JSON.stringify(reservation_info.seat),
        amount: reservation_info.amount,
        name: reservation_info.name,
        phone: reservation_info.phone,
        payment_price: reservation_info.payment_price,
      });

      const reservation = await queryRunner.manager.save(create_reservation);

      // transaction 종료
      await queryRunner.commitTransaction();
      return reservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      let error_text = '영화 예매 등록 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description 예매 영화 조회
   * @param reservation_id 예매 고유 아이디
   */
  async getReservationDetail(reservation_id: string) {
    try {
      const reservation = await this.reservationRepository.findOne({
        relations: [
          'screening_id',
          'screening_id.movie_id',
          'screening_id.theater_id',
        ],
        where: {
          id: reservation_id,
        },
        select: {
          id: true,
          payment_price: true,
          seat: true,
          name: true,
          phone: true,
          status: true,
          amount: true,
          createdAt: true,
          screening_id: {
            start_time: true,
            end_time: true,
            movie_id: {
              title: true,
              img_url: true,
            },
            theater_id: {
              name: true,
              type: true,
            },
          },
        },
      });
      if (!reservation) {
        ErrorException(HttpStatus.NOT_FOUND, '존재하지않는 예매입니다.', 404);
      }

      reservation.screening_id.movie_id.img_url = `${this.url_path}movies/${reservation.screening_id.movie_id.img_url}`;
      reservation.seat = JSON.parse(reservation.seat);
      return reservation;
    } catch (error) {
      let error_text = '예매 영화 조회 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    }
  }

  /**
   * @description 예매 조회
   * @param name 예약자 명
   * @param phone 예약자 번호
   */
  async getReservationList(name: string, phone: string) {
    try {
      const reservations = await this.reservationRepository.find({
        relations: [
          'screening_id',
          'screening_id.movie_id',
          'screening_id.theater_id',
        ],
        where: {
          name,
          phone,
        },
        order: {
          screening_id: {
            start_time: 'DESC',
          },
        },
      });
      for (const reservation of reservations) {
        reservation.seat = JSON.parse(reservation.seat);
      }
      return reservations;
    } catch (error) {
      let error_text = '예매 영화 조회 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    }
  }

  /**
   * @description 영화 예매 취소
   *
   * @param reservation_id 예매 고유 아이디
   */
  async cencelReservation(reservation_id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        Reservation,
        {
          id: reservation_id,
        },
        {
          status: '20',
        },
      );

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      let error_text = '영화 예매 취소 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description 관리자 예매 날짜 조회
   * @param start_date 시작일
   * @param end_date 종료일
   */
  async getReservationDateList(start_date: string, end_date: string) {
    try {
      const reservations = await this.reservationRepository.find({
        relations: [
          'screening_id',
          'screening_id.movie_id',
          'screening_id.theater_id',
        ],
        where: {
          createdAt: Between(
            new Date(dayjs(start_date).format('YYYY-MM-DD 00:00:00')),
            new Date(dayjs(end_date).format('YYYY-MM-DD 23:59:59')),
          ),
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return reservations;
    } catch (error) {
      let error_text = '관리자 예매 날짜 조회';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    }
  }
}
