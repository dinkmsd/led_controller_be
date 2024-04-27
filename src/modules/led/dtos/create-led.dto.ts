import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLedDTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 10.876143961570557 })
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 106.80443585691286 })
  lon: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'LED_DEMO' })
  name: string;
}
