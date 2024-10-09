import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorException } from 'src/utils/common';
import { ConfigService } from '@nestjs/config';

// repository
import { AdminRepository } from 'src/repository/admin.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly AdminRepository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  // 토큰 발급
  public async getCookieWithJwtToken(adminId: string) {
    const payload: TokenPayload = { adminId };
    const token = this.jwtService.sign(payload);
    return token;
  }

  // 토큰 검사
  async getById(id: string) {
    const admin = await this.AdminRepository.findOne({
      where: {
        id,
      },
    });
    if (admin) {
      return admin;
    }
    ErrorException(HttpStatus.NOT_FOUND, '사용자가 존재하지 않습니다.', 404);
  }

  /**
   * 로그인
   * @param account_name 관리자 계정 명
   * @param password 비밀번호
   */
  async loginAdmin(account_name: string, password: string) {
    try {
      const admin = await this.AdminRepository.findOne({
        where: { account_name },
      });
      if (!admin) {
        ErrorException(
          HttpStatus.BAD_REQUEST,
          '사용자가 존재하지 않습니다.',
          404,
        );
      }
      const isPasswordMatching = await bcrypt.compare(password, admin.password);
      if (!isPasswordMatching) {
        ErrorException(
          HttpStatus.BAD_REQUEST,
          '사용자가 존재하지 않습니다.',
          404,
        );
      }
      admin.password = undefined;
      return admin.id;
    } catch (error) {
      let error_text = '잘못된 인증 정보입니다.';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 404);
    }
  }
}
