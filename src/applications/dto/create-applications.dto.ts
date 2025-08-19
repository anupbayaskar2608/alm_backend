import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateApplicationsDto {
  @IsNotEmpty()
  @IsString()
  apm_id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  application_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  application_type: string;

  @IsNotEmpty()
  @IsString()
  application_facing_type: string;

  @IsNotEmpty()
  @IsString()
  application: string;

  @IsNotEmpty()
  @IsString()
  application_priority_type: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;
}
