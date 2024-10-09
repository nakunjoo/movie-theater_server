import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminCreateDto {
  @ApiProperty({
    example: '',
    description: '관리자 명',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '',
    description: '관리자 계정 명',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  account_name: string;

  @ApiProperty({
    example: '',
    description: '비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: '',
    description: '비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  class: string;
}
