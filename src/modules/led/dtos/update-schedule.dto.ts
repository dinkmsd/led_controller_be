import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
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
  @IsDateString()
  @ApiProperty({ example: '18:00' })
  time: Date;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  status: boolean;
}
