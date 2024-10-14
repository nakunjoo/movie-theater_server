import { Movies } from 'src/entity/movies.entity';
import { CustomRepository } from 'src/utils/typeorm-ex.decorator';
import { Repository } from 'typeorm';

@CustomRepository(Movies)
export class MovieRepository extends Repository<Movies> {}
