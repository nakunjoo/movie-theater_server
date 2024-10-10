import { Seats } from 'src/entity/seats.entity';
import { CustomRepository } from 'src/utils/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(Seats)
export class SeatRepository extends Repository<Seats> {}
