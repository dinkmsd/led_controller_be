import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FcmTokenDto {
  @ApiPropertyOptional({
    example: '',
  })
  @IsString()
  @IsOptional()
  oldToken: string;

  @ApiProperty({
    example: '',
  })
  @IsString()
  newToken: string;
}
