import { Module } from '@nestjs/common';
import { ScreeningController } from './screening.controller';
import { ScreeningService } from './screening.service';

// repositroy
import { ScreeningRepository } from 'src/repository/screening.repository';

import { TypeOrmExModule } from 'src/utils/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ScreeningRepository])],
  controllers: [ScreeningController],
  providers: [ScreeningService],
})
export class ScreeningModule {}
