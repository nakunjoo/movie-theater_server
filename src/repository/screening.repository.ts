import { Screening } from 'src/entity/screening.entity';
import { CustomRepository } from 'src/utils/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(Screening)
export class ScreeningRepository extends Repository<Screening> {}
