import { IsNotEmpty, IsString } from 'class-validator';

export class UserDetailDTO {
  @IsNotEmpty()
  @IsString()
  username: string;
}
