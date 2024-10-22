import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Movies } from 'src/entity/movies.entity';
import { Theaters } from 'src/entity/theaters.entity';

export class ScreeningCreateDto {
  @ApiProperty({
    example: '',
    description: '영화 고유 아이디',
    required: true,
  })
  @IsNotEmpty()
  movie_id: Movies;

  @ApiProperty({
    example: '',
    description: '상영관 고유 아이디',
    required: true,
  })
  @IsNotEmpty()
  theater_id: Theaters;

  @ApiProperty({
    example: '',
    description: '종류',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  kind: string;

  @ApiProperty({
    example: '',
    description: '시작시간',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  start_time: string;

  @ApiProperty({
    example: '',
    description: '종료시간',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  end_time: string;

  @ApiProperty({
    example: '',
    description: '준비시간',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ready_time: string;

  @ApiProperty({
    example: '',
    description: '준비시간',
    required: true,
  })
  create: boolean;
}
