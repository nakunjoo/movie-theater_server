import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { seatsType } from 'src/utils/types';

export class MovieUpdateDto {
  @ApiProperty({
    example: '',
    description: '영화 고유 아이디',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    example: '',
    description: '영화 제목',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: '',
    description: '영화 장르',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  genre: string;

  @ApiProperty({
    example: '',
    description: '영화 심의',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  deliberation: string;

  @ApiProperty({
    example: '',
    description: '가격',
    required: true,
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: '',
    description: '상영시간',
    required: true,
  })
  @IsNotEmpty()
  showtime: number;

  @ApiProperty({
    example: '',
    description: '개봉일',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  open_date: string;
}
