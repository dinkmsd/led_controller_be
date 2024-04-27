import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteScheduleDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '662533343f4e7bc7f001b533' })
  ledId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '662533573f4e7bc7f001b535' })
  scheduleId: string;
}
