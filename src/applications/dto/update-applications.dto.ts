import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationsDto } from './create-applications.dto';

export class UpdateApplicationDto extends PartialType(CreateApplicationsDto) {}
