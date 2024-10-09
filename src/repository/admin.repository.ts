import { Admins } from 'src/entity/admins.entity';
import { CustomRepository } from 'src/utils/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(Admins)
export class AdminRepository extends Repository<Admins> {}
