import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateSecurityGroupDto {
  @IsString()
  @IsNotEmpty()
  security_group_name: string;

  @IsArray()
  @ArrayNotEmpty() // Ensure the array is not empty
  @IsString({ each: true }) // Ensure each element is a string
  @IsOptional()
  service_names?: string[];

  @IsString()
  @IsOptional()
  notes?: string;
}
