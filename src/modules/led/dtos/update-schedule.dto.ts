import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateScheduleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '6624e9206def0ab815d5d3a6' })
  ledId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '6624e9206def0ab815d5d3a6' })
  scheduleId: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 50 })
  value: number;

  @IsOptional()
  @Matches(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])$/)
  @ApiProperty({ example: '12:00 AM' })
  time: Date;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  status: boolean;
}
