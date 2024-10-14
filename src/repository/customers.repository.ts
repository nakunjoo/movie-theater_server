import { Customers } from 'src/entity/customers.entity';
import { CustomRepository } from 'src/utils/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(Customers)
export class CustomerRepository extends Repository<Customers> {}
