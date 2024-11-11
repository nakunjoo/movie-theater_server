import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Screening } from 'src/entity/screening.entity';

export class ReservationCreateDto {
  @ApiProperty({
    example: '',
    description: '상영 영화 고유 아이디',
    required: true,
  })
  @IsNotEmpty()
  screening_id: string;

  @ApiProperty({
    example: '',
    description: '선택 좌석',
    required: true,
  })
  @IsNotEmpty()
  seat: string[];

  @ApiProperty({
    example: '',
    description: '예매 수',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: '',
    description: '예매자 명',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '',
    description: '예매자 번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: '',
    description: '결제금액',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  payment_price: number;
}
