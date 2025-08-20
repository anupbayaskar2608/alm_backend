import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateIpPoolDto {
  @IsOptional()
  @IsString()
  pool_id?: string;

  @IsOptional()
  @IsString()
  netLabel?: string;

  @IsOptional()
  @IsString()
  IP_poolAddr?: string;

  @IsOptional()
  @IsString()
  subnetMask?: string;

  @IsOptional()
  @IsString()
  CIDR?: string;

  @IsOptional()
  @IsString()
  vlanID?: string;

  @IsOptional()
  @IsString()
  gateway?: string;

  @IsOptional()
  @IsString()
  noOfHosts?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  Overlay_Network?: boolean;

  @IsOptional()
  @IsArray()
  IP_range?: string[];

  @IsOptional()
  @IsString()
  createdAt?: string;
}
