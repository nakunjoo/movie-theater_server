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
import { TheaterService } from './theater.service';

// dto
import { TheaterCreateDto } from './dto/theater_create.dto';
import { TheaterUpdateDto } from './dto/theater_update.dto';

@Controller('theater')
@ApiTags('theater')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  /**
   * @description 관리자 상영관 조회
   */
  @ApiOperation({
    summary: '관리자 상영관 조회',
    description: '관리자 상영관 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '상영관 고유 아이디',
            name: '상영관 명',
            type: '상영관 타입',
            number_seats: '상영관 좌석수',
            seats: '좌석',
            created_at: '생성일',
            updated_at: '수정일',
          },
        ],
      },
    },
  })
  @Get('/list')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async getTheaterList(@Req() req: RequestWithAdmin, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.theaterService.getTheaterList(),
    });
  }

  /**
   * @description 관리자 상영관 추가
   *
   * @param name 상영관 명
   * @param type 상영관 타입
   * @param seats 좌석 배치
   * @param number_seats 좌석 수
   */

  @ApiOperation({
    summary: '관리자 상영관 추가',
    description: '관리자 상영관 추가',
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
        name: {
          type: 'string',
          default: '',
          description: '상영관 명',
        },
        type: {
          type: 'string',
          default: '00',
          description: '상영관 타입',
        },
        seats: {
          type: 'array',
          default: [],
          description: '좌석 배치',
        },
        number_seats: {
          type: 'number',
          default: 0,
          description: '좌석 수',
        },
      },
    },
  })
  @Post('/create')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async createTheater(
    @Body() theater_info: TheaterCreateDto,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: await this.theaterService.createTheater(theater_info),
    });
  }

  /**
   * @description 관리자 상영관 상세조회
   * @param theater_id 상영관 고유 아이디
   */
  @ApiOperation({
    summary: '관리자 상영관 상세조회',
    description: '관리자 상영관 상세조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: {
          id: '상영관 고유 아이디',
          name: '상영관 명',
          type: '상영관 타입',
          number_seats: '상영관 좌석수',
          seats: '좌석',
          created_at: '생성일',
          updated_at: '수정일',
        },
      },
    },
  })
  @Get('/detail')
  @ApiQuery({
    type: 'string',
    name: 'theater_id',
    required: true,
    description: '상영관 고유 아이디',
  })
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async getTheaterDetail(
    @Query('theater_id') theater_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.theaterService.getTheaterDetail(theater_id),
    });
  }

  /**
   * @description 관리자 상영관 수정
   *
   * @param id 상영관 고유 아이디
   * @param name 상영관 명
   * @param type 상영관 타입
   * @param seats 좌석 배치
   * @param number_seats 좌석 수
   */

  @ApiOperation({
    summary: '관리자 상영관 수정',
    description: '관리자 상영관 수정',
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
        id: {
          type: 'string',
          default: '',
          description: '상영관 고유 아이디',
        },
        name: {
          type: 'string',
          default: '',
          description: '상영관 명',
        },
        type: {
          type: 'string',
          default: '00',
          description: '상영관 타입',
        },
        seats: {
          type: 'array',
          default: [],
          description: '좌석 배치',
        },
        number_seats: {
          type: 'number',
          default: 0,
          description: '좌석 수',
        },
      },
    },
  })
  @Patch('/update_detail')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async updateDetailTheater(
    @Body() theater_info: TheaterUpdateDto,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: await this.theaterService.updateDetailTheater(theater_info),
    });
  }

  /**
   * @description 관리자 상영관 삭제
   * @param movie_id 상영관 고유 아이디
   */
  @ApiOperation({
    summary: '관리자 상영관 삭제',
    description: '관리자 상영관 삭제',
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
    name: 'theater_id',
    required: true,
    description: '영화 고유 아이디',
  })
  @Delete('/delete')
  @UseGuards(JwtAuthenticationGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  async deleteTheater(
    @Query('theater_id') theater_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: await this.theaterService.deleteTheater(theater_id),
    });
  }
}
