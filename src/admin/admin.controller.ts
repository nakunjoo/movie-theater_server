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
import { AdminLoginAuthenticationGuard } from 'src/auth/guards/adminLoginAuth.guard';

// service
import { AdminService } from './admin.service';

// dto
import { AdminCreateDto } from './dto/admin_create.dto';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 관리자 계정 생성
   * @param name 관리자 명
   * @param account_name 관리자 계정 명
   * @param password 비밀번호
   * @param class 관리자 등급
   */

  @ApiOperation({
    summary: '관리자 계정 생성',
    description: '관리자 계정 생성',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @Post('/create_admin')
  @UsePipes(ValidationPipe)
  @ApiBody({
    schema: {
      properties: {
        name: {
          type: 'string',
          default: '홍길동',
          description: '관리자 명',
        },
        account_name: {
          type: 'string',
          default: 'qwer',
          description: '관리자 계정명 입력',
        },
        password: {
          type: 'string',
          default: '1234',
          description: '관리자 비밀번호 입력',
        },
        class: {
          type: 'string',
          default: '00',
          description: '관리자 등급',
        },
      },
    },
  })
  async onCreateAdmin(
    @Body() admin_info: AdminCreateDto,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    res.status(HttpStatus.OK).json({
      success: true,
      data: await this.adminService.onCreateAdmin(admin_info),
    });
  }
}
