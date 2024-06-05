import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class LedUpdateModeDTO {
  @IsNotEmpty()
  @IsString()
  ledId: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
