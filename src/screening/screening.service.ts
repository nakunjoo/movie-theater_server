import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorException } from 'src/utils/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Not, Between } from 'typeorm';
import * as fs from 'fs';

// repository
import { ScreeningRepository } from 'src/repository/screening.repository';
import { MovieRepository } from 'src/repository/movie.repository';
import { ReservationRepository } from 'src/repository/reservation.repository';

// entity
import { Screening } from 'src/entity/screening.entity';

// dto
import { ScreeningCreateDto } from './dto/screening_create.dto';
import dayjs from 'src/utils/dayjs';
import { Reservation } from 'src/entity/reservation.entity';

@Injectable()
export class ScreeningService {
  private url_path: string;
  constructor(
    private readonly screeningRepository: ScreeningRepository,
    private readonly movieRepository: MovieRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly dataSource: DataSource,
  ) {
    this.url_path = `https://storage.cloud.google.com/teak-banner-431004-n3.appspot.com/`;
  }

  /**
   * @description 상영 영화 날짜 조회
   * @param select_date 선택 날짜
   */
  async getDateScreeningList(select_date: string) {
    try {
      const movieList = await this.movieRepository.find({
        relations: [
          'screening',
          'screening.theater_id',
          'screening.reservation',
        ],
        where: {
          screening: {
            start_time: Between(
              new Date(dayjs(select_date).tz().format('YYYY-MM-DD 00:00:00')),
              new Date(dayjs(select_date).tz().format('YYYY-MM-DD 23:59:59')),
            ),
          },
        },
        order: {
          screening: {
            start_time: 'ASC',
          },
        },
      });
      const list = [];
      for (const movie of movieList) {
        const movie_data = {
          id: movie.id,
          title: movie.title,
          genre: JSON.parse(movie.genre),
          deliberation: movie.deliberation,
          showtime: movie.showtime,
          open_date: movie.open_date,
          theater: [],
        };
        for (const screenings of movie.screening) {
          const screening_data = {
            id: screenings.id,
            kind: screenings.kind,
            start_time: screenings.start_time,
            end_time: screenings.end_time,
            ready_time: screenings.ready_time,
            reservation_amount: 0,
          };
          for (const reservation of screenings.reservation) {
            if (reservation.status !== '20') {
              screening_data.reservation_amount += reservation.amount;
            }
          }

          const theater_data = {
            ...screenings.theater_id,
            screening: [screening_data],
          };

          let add = true;
          for (const theater of movie_data.theater) {
            if (theater.id === screenings.theater_id.id) {
              theater.screening.push(screening_data);
              add = false;
            }
          }
          if (add) {
            movie_data.theater.push(theater_data);
          }
        }
        list.push(movie_data);
      }
      return list;
    } catch (error) {
      let error_text = '상영 영화 날짜 조회 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    }
  }

  /**
   * @description 상영 영화 상영관,날짜 조회
   * @param select_date 선택 날짜
   * @param theater_id 상영관 고유 아이디
   */
  async getDateTheaterScreeningList(select_date: string, theater_id: string) {
    try {
      const screeningList = await this.screeningRepository.find({
        relations: ['movie_id', 'theater_id'],
        where: {
          start_time: Between(
            new Date(dayjs(select_date).tz().format('YYYY-MM-DD 00:00:00')),
            new Date(dayjs(select_date).tz().format('YYYY-MM-DD 23:59:59')),
          ),
          theater_id: {
            id: theater_id,
          },
        },
      });
      return screeningList;
    } catch (error) {
      let error_text = '상영 영화 날짜 조회 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    }
  }

  /**
   * @description 관리자 상영 영화 등록
   *
   * @param movie_id 영화 고유 아이디
   * @param theater_id 상영관 고유 아이디
   * @param kind 종류
   * @param start_time 시작시간
   * @param end_time 종료시간
   * @param ready_time 준비시간
   */
  async createScreening(screeningList: ScreeningCreateDto[]) {
    // transaction 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const screening of screeningList) {
        if (screening.create) {
          const create_screening = this.screeningRepository.create({
            movie_id: screening.movie_id,
            theater_id: screening.theater_id,
            kind: screening.kind,
            start_time: screening.start_time,
            end_time: screening.end_time,
            ready_time: screening.ready_time,
          });
          await queryRunner.manager.save(create_screening);
        }
      }
      // transaction 종료
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      let error_text = '관리자 상영 영화 등록 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description 관리자 상영영화 상세 조회
   * @param screening_id 상영영화 고유 아이디
   */

  async getScreeningDetail(screening_id: string) {
    try {
      const screening = await this.screeningRepository.findOne({
        relations: ['movie_id', 'theater_id', 'theater_id.seat'],
        where: {
          id: screening_id,
        },
      });
      if (!screening) {
        ErrorException(
          HttpStatus.NOT_FOUND,
          '존재하지않는 상영정보입니다.',
          404,
        );
      }
      const reservaions = await this.reservationRepository.find({
        where: {
          screening_id: {
            id: screening.id,
          },
          status: Not('20'),
        },
      });
      for (const reservaion of reservaions) {
        reservaion.seat = JSON.parse(reservaion.seat);
      }
      screening.reservation = reservaions;
      screening.movie_id.img_url = `${this.url_path}movies/${screening.movie_id.img_url}`;
      screening.movie_id.genre = JSON.parse(screening.movie_id.genre);
      return screening;
    } catch (error) {
      let error_text = '상영영화 상세 조회 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    }
  }

  /**
   * @description 관리자 상영영화 삭제
   * @param screening_id 상영영화  고유 아이디
   */
  async deleteScreening(screening_id: string) {
    // transaction 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.softDelete(Screening, { id: screening_id });

      // transaction 종료
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      let error_text = '관리자 상영영화 삭제 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description 상영영화 좌석 조회
   * @param screening_id 상영영화 고유 아이디
   */

  async getScreeningSeat(screening_id: string) {
    try {
      const screening = await this.screeningRepository.findOne({
        relations: ['movie_id', 'theater_id', 'theater_id.seat'],
        where: {
          id: screening_id,
        },
      });
      if (!screening) {
        ErrorException(
          HttpStatus.NOT_FOUND,
          '존재하지않는 상영정보입니다.',
          404,
        );
      }
      const reservations = await this.reservationRepository.find({
        where: {
          screening_id: {
            id: screening.id,
          },
          status: Not('20'),
        },
      });
      for (const reservation of reservations) {
        reservation.seat = JSON.parse(reservation.seat);
      }
      screening.reservation = reservations;
      return screening;
    } catch (error) {
      let error_text = '상영영화 좌석 조회 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    }
  }
}
