import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoginStrategy } from './strategies/login.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

import { TypeOrmExModule } from 'src/utils/typeorm-ex.module';

// repositroy
import { AdminRepository } from 'src/repository/admin.repository';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}m`,
        },
      }),
    }),
    TypeOrmExModule.forCustomRepository([AdminRepository]),
  ],
  providers: [AuthService, LoginStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
