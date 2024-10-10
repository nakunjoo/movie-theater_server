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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import express, { Request, Response } from 'express';
import RequestWithAdmin from 'src/auth/requestWithAdmin.interface';
import { JwtAuthenticationGuard } from 'src/auth/guards/jwtAuth.guard';

// service
import { TheaterService } from './theater.service';

// dto
import { TheaterCreateDto } from './dto/theater_create.dto';

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
          description: '극장 명',
        },
        type: {
          type: 'string',
          default: '00',
          description: '극장 타입',
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
}
