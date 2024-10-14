import {
  Controller,
  Get,
  Post,
  ValidationPipe,
  Body,
  Res,
  Req,
  UsePipes,
  HttpStatus,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import express, { Request, Response } from 'express';
import RequestWithAdmin from 'src/auth/requestWithAdmin.interface';
import { JwtAuthenticationGuard } from 'src/auth/guards/jwtAuth.guard';

// service
import { MovieService } from './movie.service';

@Controller('movie')
@ApiTags('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  /**
   * @description 관리자 영화 조회
   */
  @ApiOperation({
    summary: '관리자 영화 조회',
    description: '관리자 영화 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '영화 고유 아이디',
            title: '영화 명',
            genre: '영화 장르',
            deliberation: '영화 심의',
            price: '가격',
            showtime: '상영시간',
            status: '상태값',
            created_at: '생성일',
            updated_at: '수정일',
          },
        ],
      },
    },
  })
  @Get('/list')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(ValidationPipe)
  async getMovieList(@Req() req: RequestWithAdmin, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.movieService.getMovieList(),
    });
  }
}
