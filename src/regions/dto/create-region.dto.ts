import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRegionDto {
  @IsString()
  @IsNotEmpty()
  region_name: string;

  @IsString()
  @IsNotEmpty()
  postal_address: string;

  @IsString()
  @IsOptional()
  notes?: string;
}