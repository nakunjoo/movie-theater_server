import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorException } from 'src/utils/common';
import { DataSource, Not } from 'typeorm';
import * as fs from 'fs';

// entity
import { Movies } from 'src/entity/movies.entity';

// repository
import { MovieRepository } from 'src/repository/movie.repository';

// dto
import { MovieCreateDto } from './dto/movie_create.dto';
import { MovieUpdateDto } from './dto/movie_update.dto';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * @description 영화 조회
   */
  async getMovieList() {
    try {
      const movies = await this.movieRepository.find({});
      if (movies.length > 0) {
        for (const movie of movies) {
          const url = await fs.readFileSync(
            `${process.cwd()}/uploads/${movie.img_url}`,
            'base64',
          );
          movie.img_url = `data:image/jpeg;base64,${url}`;
          movie.genre = JSON.parse(movie.genre);
        }
      }
      return movies;
    } catch (error) {
      console.log('error:', error);
      ErrorException(HttpStatus.NOT_FOUND, '영화 조회 실패', 404);
    }
  }

  /**
   * @description 관리자 영화 등록
   * @param title 영화제목
   * @param genre 영화장르
   * @param deliberation 영화 심의
   * @param price 영화 가격
   * @param showtime 영화 상영시간
   * @param file 영화 포스터이미지 파일
   * @param open_date 영화 개봉일
   */

  async createMovie(file: Express.Multer.File, movie_info: MovieCreateDto) {
    // transaction 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const create_movie = this.movieRepository.create({
        title: movie_info.title,
        genre: movie_info.genre,
        deliberation: movie_info.deliberation,
        price: movie_info.price,
        showtime: movie_info.showtime,
        img_url: file.filename,
        status: '00',
        open_date: movie_info.open_date,
      });

      const movie = await queryRunner.manager.save(create_movie);

      // transaction 종료
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      let error_text = '영화 생성 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description 영화 상세 조회
   * @param movie_id 영화 고유 아이디
   */

  async getMovieDetail(movie_id: string) {
    try {
      const movie = await this.movieRepository.findOne({
        where: {
          id: movie_id,
        },
      });
      if (!movie) {
        ErrorException(HttpStatus.NOT_FOUND, '존재하지않는 영화입니다.', 404);
      }
      const url = await fs.readFileSync(
        `${process.cwd()}/uploads/${movie.img_url}`,
        'base64',
      );
      movie.img_url = `data:image/jpeg;base64,${url}`;
      movie.genre = JSON.parse(movie.genre);
      return movie;
    } catch (error) {
      let error_text = '영화 상세 조회 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    }
  }

  /**
   * @description 관리자 영화 수정
   * @param id 영화 고유 아이디
   * @param title 영화제목
   * @param genre 영화장르
   * @param deliberation 영화 심의
   * @param price 영화 가격
   * @param showtime 영화 상영시간
   * @param file 영화 포스터이미지 파일
   * @param open_date 영화 개봉일
   */
  async updateDetailMovie(
    file: Express.Multer.File,
    movie_info: MovieUpdateDto,
  ) {
    // transaction 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { id, title, genre, deliberation, price, showtime, open_date } =
        movie_info;

      const movie = await queryRunner.manager.findOne(Movies, {
        where: {
          id,
        },
      });

      let img_url = movie?.img_url;

      if (file) {
        const fileCheck = fs.existsSync(
          `${process.cwd()}/uploads/${movie.img_url}`,
        );
        if (fileCheck) {
          fs.unlinkSync(`${process.cwd()}/uploads/${movie.img_url}`);
        }
        img_url = file.filename;
      }

      await queryRunner.manager.update(
        Movies,
        {
          id,
        },
        {
          title,
          genre,
          deliberation,
          price,
          showtime,
          img_url,
          open_date,
        },
      );

      // transaction 종료
      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      let error_text = '영화 수정 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * @description 관리자 영화 삭제
   * @param movie_id 영화 고유 아이디
   */

  async deleteMovie(movie_id: string) {
    // transaction 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const movie = await queryRunner.manager.findOne(Movies, {
        where: {
          id: movie_id,
        },
      });

      const fileCheck = fs.existsSync(
        `${process.cwd()}/uploads/${movie.img_url}`,
      );
      if (fileCheck) {
        fs.unlinkSync(`${process.cwd()}/uploads/${movie.img_url}`);
      }
      await queryRunner.manager.softDelete(Movies, { id: movie_id });

      // transaction 종료
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      let error_text = '영화 삭제 조회 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
