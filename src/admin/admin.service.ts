import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorException } from 'src/utils/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

// repository
import { AdminRepository } from 'src/repository/admin.repository';

// dto
import { AdminCreateDto } from './dto/admin_create.dto';

// entity
import { Admins } from 'src/entity/admins.entity';

@Injectable()
export class AdminService {
  constructor(
    private readonly AdminRepository: AdminRepository,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 관리자 계정 생성
   * @param name 관리자 명
   * @param account_name 관리자 계정 명
   * @param password 비밀번호
   * @param class 관리자 등급
   */
  async onCreateAdmin(admin_info: AdminCreateDto) {
    // transaction 시작
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 아이디 중복 체크
      const id_check = await queryRunner.manager.findOne(Admins, {
        where: {
          account_name: admin_info.account_name,
        },
      });
      if (id_check) {
        ErrorException(HttpStatus.BAD_REQUEST, '중복된 아이디 입니다.', 400);
      }
      // 비밀번호 암호화
      const hashPassword = await bcrypt.hash(admin_info.password, 10);

      const create_admin = this.AdminRepository.create({
        name: admin_info.name,
        account_name: admin_info.account_name,
        password: hashPassword,
        class: admin_info.class,
      });
      const admin = await queryRunner.manager.save(create_admin);
      // transaction 종료
      await queryRunner.commitTransaction();
      return admin;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      let error_text = '관리자 생성 요청 실패';
      if (error.response) {
        error_text = error.response.error;
      }
      ErrorException(HttpStatus.BAD_REQUEST, error_text, 400);
    } finally {
      await queryRunner.release();
    }
  }
}
