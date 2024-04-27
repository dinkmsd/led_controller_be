import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateScheduleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '6624cf2f9c51b2311c8a02ac' })
  ledId: string;

  @IsNotEmpty()
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
  @ApiProperty({ example: '12:00' })
  time: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 90 })
  value: number;
}
