import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteGroupDTO {
  @IsNotEmpty()
  @IsString()
  groupId: string;
}
