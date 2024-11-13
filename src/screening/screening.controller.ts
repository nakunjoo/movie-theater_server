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
import { ScreeningService } from './screening.service';

// dto
import { ScreeningCreateDto } from './dto/screening_create.dto';

@Controller('screening')
@ApiTags('screening')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) {}

  /**
   * @description 관리자 상영 영화 날짜 조회
   * @param select_date 선택 날짜
   */
  @ApiOperation({
    summary: '관리자 상영 영화 날짜 조회',
    description: '관리자 상영 영화 날짜 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: {
          id: '상영 영화 고유 아이디',
          movie: '영화',
          theater: '상영관',
          kind: '종류',
          start_time: '시작시간',
          end_time: '종료시간',
          ready_time: '준비시간',
          created_at: '생성일',
          updated_at: '수정일',
        },
      },
    },
  })
  @ApiQuery({
    type: 'string',
    name: 'select_date',
    required: true,
    description: '선택날짜',
  })
  @Get('/manager_date_list')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async getManagerDateScreeningList(
    @Query('select_date') select_date: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.screeningService.getDateScreeningList(select_date),
    });
  }

  /**
   * @description 상영 영화 상영관,날짜 조회
   * @param select_date 선택 날짜
   * @param theater_id 상영관 고유 아이디
   */
  @ApiOperation({
    summary: '상영 영화 상영관,날짜 조회',
    description: '상영 영화 상영관,날짜 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: {
          id: '상영 영화 고유 아이디',
          movie: '영화',
          theater: '상영관',
          kind: '종류',
          start_time: '시작시간',
          end_time: '종료시간',
          ready_time: '준비시간',
          created_at: '생성일',
          updated_at: '수정일',
        },
      },
    },
  })
  @ApiQuery({
    type: 'string',
    name: 'select_date',
    required: true,
    description: '선택날짜',
  })
  @ApiQuery({
    type: 'string',
    name: 'theater_id',
    required: true,
    description: '상영관 고유 아이디',
  })
  @Get('/date_theater_list')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async getDateTheaterScreeningList(
    @Query('select_date') select_date: string,
    @Query('theater_id') theater_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.screeningService.getDateTheaterScreeningList(
        select_date,
        theater_id,
      ),
    });
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

  @ApiOperation({
    summary: '관리자 상영 영화 등록',
    description: '관리자 상영 영화 등록',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBody({
    schema: {
      properties: {
        movie_id: {
          type: 'string',
          default: '',
          description: '영화 고유 아이디',
        },
        theater_id: {
          type: 'string',
          default: '',
          description: '상영관 고유 아이디',
        },
        kind: {
          type: 'string',
          default: '00',
          description: '종류',
        },
        start_time: {
          type: 'date',
          description: '시작시간',
        },
        end_time: {
          type: 'date',
          description: '종료시간',
        },
        ready_time: {
          type: 'date',
          description: '준비시간',
        },
      },
    },
  })
  @Post('/create')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async createScreening(
    @Body('screeningList') screeningList: ScreeningCreateDto[],
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: await this.screeningService.createScreening(screeningList),
    });
  }

  /**
   * @description 관리자 상영영화 상세 조회
   * @param screening_id 상영영화 고유 아이디
   */
  @ApiOperation({
    summary: '상영영화 상세 조회',
    description: '상영영화 상세 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: {
          id: '영화 고유 아이디',
          movie_id: '영화',
          theater_id: '상영관',
          kind: '종류',
          start_time: '영화 가격',
          end_time: '상영시간',
          ready_time: '포스터 이미지',
          created_at: '생성일',
          updated_at: '수정일',
        },
      },
    },
  })
  @ApiQuery({
    type: 'string',
    name: 'screening_id',
    required: true,
    description: '상영영화 고유 아이디',
  })
  @Get('/detail')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async getScreeningDetail(
    @Query('screening_id') screening_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.screeningService.getScreeningDetail(screening_id),
    });
  }

  /**
   * @description 관리자 상영영화 삭제
   * @param screening_id 상영영화  고유 아이디
   */
  @ApiOperation({
    summary: '관리자 상영영화 삭제',
    description: '관리자 상영영화 삭제',
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
    name: 'screening_id',
    required: true,
    description: '영화 고유 아이디',
  })
  @Delete('/delete')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async deleteScreening(
    @Query('screening_id') screening_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: await this.screeningService.deleteScreening(screening_id),
    });
  }

  /**
   * @description 상영 영화 날짜 조회
   * @param select_date 선택 날짜
   */
  @ApiOperation({
    summary: '상영 영화 날짜 조회',
    description: '상영 영화 날짜 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: {
          id: '상영 영화 고유 아이디',
          movie: '영화',
          theater: '상영관',
          kind: '종류',
          start_time: '시작시간',
          end_time: '종료시간',
          ready_time: '준비시간',
          created_at: '생성일',
          updated_at: '수정일',
        },
      },
    },
  })
  @ApiQuery({
    type: 'string',
    name: 'select_date',
    required: true,
    description: '선택날짜',
  })
  @Get('/date_list')
  @UsePipes(ValidationPipe)
  async getDateScreeningList(
    @Query('select_date') select_date: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.screeningService.getDateScreeningList(select_date),
    });
  }

  /**
   * @description 상영영화 좌석 조회
   * @param screening_id 상영영화 고유 아이디
   */
  @ApiOperation({
    summary: '상영영화 좌석 조회',
    description: '상영영화 좌석 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: {
          id: '영화 고유 아이디',
          movie_id: '영화',
          theater_id: '상영관',
          kind: '종류',
          start_time: '영화 가격',
          end_time: '상영시간',
          ready_time: '포스터 이미지',
          created_at: '생성일',
          updated_at: '수정일',
        },
      },
    },
  })
  @ApiQuery({
    type: 'string',
    name: 'screening_id',
    required: true,
    description: '상영영화 고유 아이디',
  })
  @Get('/seat_list')
  @UsePipes(ValidationPipe)
  async getScreeningSeat(
    @Query('screening_id') screening_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.screeningService.getScreeningSeat(screening_id),
    });
  }
}
