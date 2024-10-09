import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

// repositroy
import { AdminRepository } from 'src/repository/admin.repository';

import { TypeOrmExModule } from 'src/utils/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([AdminRepository])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
