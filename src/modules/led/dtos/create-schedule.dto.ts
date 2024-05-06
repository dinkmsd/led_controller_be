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
  @Matches(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/)
  @ApiProperty({ example: '12:00 AM' })
  time: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 90 })
  value: number;
}
