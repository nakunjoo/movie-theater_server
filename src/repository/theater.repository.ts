import { Theaters } from 'src/entity/theaters.entity';
import { CustomRepository } from 'src/utils/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(Theaters)
export class TheaterRepository extends Repository<Theaters> {}
