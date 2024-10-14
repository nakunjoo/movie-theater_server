import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorException } from 'src/utils/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Not } from 'typeorm';

// entity
import { Movies } from 'src/entity/movies.entity';

// repository
import { MovieRepository } from 'src/repository/movie.repository';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * @description 관리자 영화 조회
   */
  async getMovieList() {
    try {
      const movies = await this.movieRepository.find({});
      return movies;
    } catch (error) {
      console.log('error:', error);
      ErrorException(HttpStatus.NOT_FOUND, '관리자 영화 조회 실패', 404);
    }
  }
}
