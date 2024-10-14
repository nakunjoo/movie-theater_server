import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

// repositroy
import { MovieRepository } from 'src/repository/movie.repository';

import { TypeOrmExModule } from 'src/utils/typeorm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([MovieRepository])],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
