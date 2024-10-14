import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

// repositroy
import { CustomerRepository } from 'src/repository/customers.repository';

import { TypeOrmExModule } from 'src/utils/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([CustomerRepository])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
