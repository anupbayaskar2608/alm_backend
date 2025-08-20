import { IsString } from 'class-validator';

export class DeleteWorkloadDto {
  @IsString()
  deletedBy: string;
}
