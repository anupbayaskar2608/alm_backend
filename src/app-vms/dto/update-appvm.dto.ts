import { PartialType } from '@nestjs/mapped-types';
import { CreateAppVmDto } from './create-appvm.dto';
import { IsOptional, IsArray } from 'class-validator';

export class UpdateAppVmDto extends PartialType(CreateAppVmDto) {
  @IsArray()
  @IsOptional()
  vm_id_edit?: string[];
}
