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
  UseInterceptors,
  UploadedFile,
  Delete,
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
import { FileInterceptor } from '@nestjs/platform-express';

// dto
import { MovieCreateDto } from './dto/movie_create.dto';
import { MovieUpdateDto } from './dto/movie_update.dto';

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
  @Get('/manager_list')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async getManagerMovieList(
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.movieService.getMovieList(),
    });
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
  @ApiOperation({
    summary: '관리자 영화 등록',
    description: '관리자 영화 등록',
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
  @ApiBody({
    schema: {
      properties: {
        name: {
          type: 'title',
          default: '',
          description: '영화 제목',
        },
        genre: {
          type: 'string[]',
          default: '[]',
          description: '영화장르',
        },
        deliberation: {
          type: 'string',
          default: '00',
          description: '심의',
        },
        price: {
          type: 'number',
          default: 0,
          description: '금액',
        },
        showtime: {
          type: 'number',
          default: 0,
          description: '상영시간',
        },
        file: {
          type: 'file',
          description: '포스터 이미지파일',
        },
        open_date: {
          type: 'Date',
          description: '개봉일',
        },
      },
    },
  })
  @Post('/create')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async createMovie(
    @UploadedFile() file: Express.Multer.File,
    @Body() movie_info: MovieCreateDto,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: await this.movieService.createMovie(file, movie_info),
    });
  }

  /**
   * @description 영화 상세 조회
   * @param movie_id 영화 고유 아이디
   */
  @ApiOperation({
    summary: '영화 상세 조회',
    description: '영화 상세 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: {
          id: '영화 고유 아이디',
          title: '영화 제목',
          genre: '영화 장르',
          deliberation: '영화 심의',
          price: '영화 가격',
          showtime: '상영시간',
          img_url: '포스터 이미지',
          status: '상태값',
          created_at: '생성일',
          updated_at: '수정일',
        },
      },
    },
  })
  @ApiQuery({
    type: 'string',
    name: 'movie_id',
    required: true,
    description: '영화 고유 아이디',
  })
  @Get('/detail')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async getMovieDetail(
    @Query('movie_id') movie_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.movieService.getMovieDetail(movie_id),
    });
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
  @ApiOperation({
    summary: '관리자 영화 수정',
    description: '관리자 영화 수정',
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
  @ApiBody({
    schema: {
      properties: {
        id: {
          type: 'string',
          default: '',
          description: '영화 고융 아이디',
        },
        name: {
          type: 'title',
          default: '',
          description: '영화 제목',
        },
        genre: {
          type: 'string[]',
          default: '[]',
          description: '영화장르',
        },
        deliberation: {
          type: 'string',
          default: '00',
          description: '심의',
        },
        price: {
          type: 'number',
          default: 0,
          description: '금액',
        },
        showtime: {
          type: 'number',
          default: 0,
          description: '상영시간',
        },
        file: {
          type: 'file',
          description: '포스터 이미지파일',
        },
        open_date: {
          type: 'Date',
          description: '개봉일',
        },
      },
    },
  })
  @Patch('/update_detail')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async updateDetailMovie(
    @UploadedFile() file: Express.Multer.File,
    @Body() movie_info: MovieUpdateDto,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: await this.movieService.updateDetailMovie(file, movie_info),
    });
  }

  /**
   * @description 관리자 영화 삭제
   * @param movie_id 영화 고유 아이디
   */
  @ApiOperation({
    summary: '관리자 영화 삭제',
    description: '관리자 영화 삭제',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiQuery({
    type: 'string',
    name: 'movie_id',
    required: true,
    description: '영화 고유 아이디',
  })
  @Delete('/delete')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async deleteMovie(
    @Query('movie_id') movie_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: await this.movieService.deleteMovie(movie_id),
    });
  }

  /**
   * @description 영화 조회
   */
  @ApiOperation({
    summary: '영화 조회',
    description: '영화 조회',
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
  @UsePipes(ValidationPipe)
  async getMovieList(@Req() req: RequestWithAdmin, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.movieService.getMovieList(),
    });
  }
}
