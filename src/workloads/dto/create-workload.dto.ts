import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateWorkloadDto {
  @IsString()
  @IsNotEmpty()
  vm_name: string;

  @IsString()
  @IsOptional()
  host_ip?: string;

  @IsString()
  @IsOptional()
  vm_guest_os?: string;

  @IsString()
  @IsOptional()
  vm_network?: string;

  @IsArray()
  @IsOptional()
  nic_ids?: { id: string; ip: string; netLabel: string }[];

  @IsNumber()
  @IsOptional()
  NICs?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
