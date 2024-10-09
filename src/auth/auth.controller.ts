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
import RequestWithAdmin from './requestWithAdmin.interface';
import { LoginAuthenticationGuard } from './guards/loginAuth.guard';

// service
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description 관리자 로그인
   *
   * @param account_name 관리자 계정명
   * @param password 비밀번호
   */
  @ApiOperation({
    summary: '관리자 로그인',
    description: '관리자 로그인',
  })
  @ApiCreatedResponse({
    description: '성공여부',
    schema: {
      example: {
        success: true,
      },
    },
  })
  @Post('/login')
  @UseGuards(LoginAuthenticationGuard)
  @UsePipes(ValidationPipe)
  @ApiBody({
    schema: {
      properties: {
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
      },
    },
  })
  async loginAdmin(
    @Body('account_name') account_name: string,
    @Body('password') password: string,
    @Req() req: RequestWithAdmin,
    @Res() res: Response,
  ) {
    const admin = await this.authService.getById(req.user);
    const token = await this.authService.getCookieWithJwtToken(admin.id);

    return res.status(HttpStatus.OK).json({
      success: true,
      data: {
        admin,
        token,
      },
    });
  }
}
