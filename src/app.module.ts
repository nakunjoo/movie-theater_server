import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

// controller

// module
import { MySqlConfigModule } from './configs/db/config.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { TheaterModule } from './theater/theater.module';
import { MovieModule } from './movie/movie.module';
import { ReservationModule } from './reservation/reservation.module';
import { ScreeningModule } from './screening/screening.module';

// service
import { MySqlConfigService } from './configs/db/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        //…
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [MySqlConfigModule],
      useClass: MySqlConfigService,
      inject: [MySqlConfigService],
    }),
    AuthModule,
    AdminModule,
    TheaterModule,
    MovieModule,
    ReservationModule,
    ScreeningModule,
  ],
})
export class AppModule {}
