import {
  Controller,
  Get,
  Post,
  ValidationPipe,
  Body,
  Res,
  Req,
  UsePipes,
  HttpStatus,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import express, { Request, Response } from 'express';
import RequestWithAdmin from 'src/auth/requestWithAdmin.interface';
import { JwtAuthenticationGuard } from 'src/auth/guards/jwtAuth.guard';

// service
import { ReservationService } from './reservation.service';

@Controller('reservation')
@ApiTags('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
}