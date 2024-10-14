import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

// repositroy
import { ReservationRepository } from 'src/repository/reservation.repository';

import { TypeOrmExModule } from 'src/utils/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ReservationRepository])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
