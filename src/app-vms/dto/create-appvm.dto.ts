import { IsArray, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAppVmDto {
  @IsString()
  @IsNotEmpty()
  apm_id: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  dept: string;

  @IsString()
  @IsNotEmpty()
  owner_id: string;

  @IsString()
  @IsOptional()
  secgrp?: string;

  @IsString()
  @IsOptional()
  assigndby?: string;

  @IsNumber()
  @IsOptional()
  requestID?: number;

  @IsArray()
  vm_id: string[];

  @IsString()
  @IsOptional()
  comments?: string;
}
