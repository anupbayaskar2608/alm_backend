import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  service_name: string;

  @IsNumber()
  ports: number;

  @IsString()
  @IsNotEmpty()
  protocols: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
