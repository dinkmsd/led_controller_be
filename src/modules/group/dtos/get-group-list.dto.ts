import { IsNotEmpty, IsString } from 'class-validator';

export class GetDetailGroupDTO {
  @IsNotEmpty()
  @IsString()
  groupId: string;
}
