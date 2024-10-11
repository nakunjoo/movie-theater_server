import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { seatsType } from 'src/utils/types';

export class TheaterUpdateDto {
  @ApiProperty({
    example: '',
    description: '상영관 고유 아이디',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;
  @ApiProperty({
    example: '',
    description: '상영관 명',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '',
    description: '상영관 타입',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    example: '',
    description: '좌석 배치',
    required: true,
  })
  @IsNotEmpty()
  seats: seatsType[];

  @ApiProperty({
    example: '',
    description: '좌석 수',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  number_seats: number;
}
