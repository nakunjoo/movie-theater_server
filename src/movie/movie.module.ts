import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/configs/upload/multer.config';

// repositroy
import { MovieRepository } from 'src/repository/movie.repository';

import { TypeOrmExModule } from 'src/utils/typeorm-ex.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    TypeOrmExModule.forCustomRepository([MovieRepository]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
