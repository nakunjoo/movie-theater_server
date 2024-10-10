import { Module } from '@nestjs/common';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';

// repositroy
import { TheaterRepository } from 'src/repository/theater.repository';
import { SeatRepository } from 'src/repository/seat.repository';

import { TypeOrmExModule } from 'src/utils/typeorm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([TheaterRepository, SeatRepository]),
  ],
  controllers: [TheaterController],
  providers: [TheaterService],
})
export class TheaterModule {}
