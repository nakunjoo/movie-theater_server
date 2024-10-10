import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorException } from 'src/utils/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

// repository
import { TheaterRepository } from 'src/repository/theater.repository';
import { SeatRepository } from 'src/repository/seat.repository';

// entity
import { Theaters } from 'src/entity/theaters.entity';

// dto
import { TheaterCreateDto } from './dto/theater_create.dto';

@Injectable()
export class TheaterService {
  constructor(
    private readonly theaterRepository: TheaterRepository,
    private readonly seatRepository: SeatRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * @description 관리자 상영관 조회
   */
  async getTheaterList() {
    try {
      const theaters = await this.theaterRepository.find({});
      return theaters;
    } catch (error) {
      console.log('error:', error);
      ErrorException(HttpStatus.NOT_FOUND, '관리자 상영관 조회 실패', 404);
    }
  }

  /**
   * @description 관리자 상영관 추가
   *
   * @param name 상영관 명
   * @param type 상영관 타입
   * @param seats 좌석 배치
   * @param number_seats 좌석 수
   */
  async createTheater(theater_info: TheaterCreateDto) {
    // transaction 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const name_check = await queryRunner.manager.findOne(Theaters, {
        where: {
          name: theater_info.name,
        },
      });
      if (name_check) {
        ErrorException(
          HttpStatus.BAD_REQUEST,
          '중복된 이름의 상영관이 존재합니다.',
          400,
        );
      }

      const create_theater = this.theaterRepository.create({
        name: theater_info.name,
        type: theater_info.type,
        number_seats: theater_info.number_seats,
      });
      const theater = await queryRunner.manager.save(create_theater);

      for (const seat of theater_info.seats) {
        const rows = JSON.stringify(seat.rows);
        const create_seat = this.seatRepository.create({
          theater_id: theater,
          line: seat.line,
          rows,
        });
        await queryRunner.manager.save(create_seat);
      }

      // transaction 종료
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      let error_text = '상영관 생성 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
