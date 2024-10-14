import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ErrorException } from 'src/utils/common';
import { ConfigService } from '@nestjs/config';
import { DataSource, Not } from 'typeorm';

// entity
import { Customers } from 'src/entity/customers.entity';

@Injectable()
export class CustomerService {
  constructor(private readonly dataSource: DataSource) {}
}
