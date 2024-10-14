import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorException } from 'src/utils/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Not } from 'typeorm';

// entity
import { Screening } from 'src/entity/screening.entity';

@Injectable()
export class ScreeningService {
  constructor(private readonly dataSource: DataSource) {}
}
