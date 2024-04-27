import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateLumiDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '662533343f4e7bc7f001b533' })
  ledId: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 30 })
  value: number;
}
