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
import { ReservationService } from './reservation.service';

// dto
import { ReservationCreateDto } from './dto/reservation_create.dto';

@Controller('reservation')
@ApiTags('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

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

  @ApiOperation({
    summary: '영화 예매 등록',
    description: '영화 예매 등록',
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
        screening_id: {
          type: 'string',
          default: '',
          description: '상영 영화 고유 아이디',
        },
        seat: {
          type: 'string[]',
          default: '',
          description: '선택좌석',
        },
        amount: {
          type: 'number',
          default: '0',
          description: '예매 수',
        },
        name: {
          type: 'string',
          default: '',
          description: '예매자 명',
        },
        phone: {
          type: 'string',
          default: '',
          description: '예매자 번호',
        },
        payment_price: {
          type: 'number',
          default: '0',
          description: '결제금액',
        },
      },
    },
  })
  @Post('/create')
  @UsePipes(ValidationPipe)
  async createReservation(
    @Body() reservation_info: ReservationCreateDto,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.reservationService.createReservation(reservation_info),
    });
  }

  /**
   * @description 예매 영화 조회
   * @param reservation_id 예매 고유 아이디
   */
  @ApiOperation({
    summary: '예매 영화 조회',
    description: '예매 영화 조회',
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
  @Get('/detail')
  @ApiQuery({
    type: 'string',
    name: 'reservation_id',
    required: true,
    description: '상영관 고유 아이디',
  })
  @UsePipes(ValidationPipe)
  async getReservationDetail(
    @Query('reservation_id') reservation_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.reservationService.getReservationDetail(reservation_id),
    });
  }

  /**
   * @description 예약 조회
   * @param name 예약자 명
   * @param phone 예약자 번호
   */
  @ApiOperation({
    summary: '예약 조회',
    description: '예약 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '예약 고유 아이디',
            screening_id: '상영 영화',
            seat: '선택좌석',
            status: '상태값',
            amount: '예매수',
            name: '예약자명',
            phone: '예약자번호',
            payment_price: '결제금액',
            created_at: '생성일',
            updated_at: '수정일',
          },
        ],
      },
    },
  })
  @ApiQuery({
    type: 'string',
    name: 'name',
    required: true,
    description: '예약자 명',
  })
  @ApiQuery({
    type: 'string',
    name: 'phone',
    required: true,
    description: '예약자 번호',
  })
  @Get('/list')
  @UsePipes(ValidationPipe)
  async getReservationList(
    @Query('name') name: string,
    @Query('phone') phone: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.reservationService.getReservationList(name, phone),
    });
  }

  /**
   * @description 영화 예매 취소
   *
   * @param reservation_id 예매 고유 아이디
   */

  @ApiOperation({
    summary: '영화 예매 등록',
    description: '영화 예매 등록',
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
        reservation_id: {
          type: 'string',
          default: '',
          description: '예매 고유 아이디',
        },
      },
    },
  })
  @Patch('/cencel')
  @UsePipes(ValidationPipe)
  async cencelReservation(
    @Body('reservation_id') reservation_id: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: await this.reservationService.cencelReservation(reservation_id),
    });
  }

  /**
   * @description 관리자 예매 날짜 조회
   * @param start_date 시작일
   * @param end_date 종료일
   */
  @ApiOperation({
    summary: '관리자 예매 날짜 조회',
    description: '관리자 예매 날짜 조회',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '예약 고유 아이디',
            screening_id: '상영 영화',
            seat: '선택좌석',
            status: '상태값',
            amount: '예매수',
            name: '예약자명',
            phone: '예약자번호',
            payment_price: '결제금액',
            created_at: '생성일',
            updated_at: '수정일',
          },
        ],
      },
    },
  })
  @ApiQuery({
    type: 'string',
    name: 'start_date',
    required: true,
    description: '시작일',
  })
  @ApiQuery({
    type: 'string',
    name: 'end_date',
    required: true,
    description: '종료일',
  })
  @Get('/manager_date_list')
  @UsePipes(ValidationPipe)
  async getReservationDateList(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({
      success: true,
      data: await this.reservationService.getReservationDateList(
        start_date,
        end_date,
      ),
    });
  }
}
