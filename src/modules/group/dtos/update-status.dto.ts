import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStatusDTO {
  @IsNotEmpty()
  @IsString()
  groupId: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
