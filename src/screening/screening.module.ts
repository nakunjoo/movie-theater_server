import { Module } from '@nestjs/common';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';

// repositroy
import { ScreeningRepository } from 'src/repository/screening.repository';
import { MovieRepository } from 'src/repository/movie.repository';
import { ReservationRepository } from 'src/repository/reservation.repository';

import { TypeOrmExModule } from 'src/utils/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ScreeningRepository,
      MovieRepository,
      ReservationRepository,
    ]),
  ],
  controllers: [ScreeningController],
  providers: [ScreeningService],
})
export class ScreeningModule {}
