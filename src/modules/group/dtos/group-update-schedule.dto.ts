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

export class GroupUpdateScheduleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '66514686f731c9503c7b4fb6' })
  scheId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '6645af562c2ff75648cbeaec' })
  groupId: string;

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
