import { PartialType } from '@nestjs/swagger';
import { CreateIpPoolDto } from './create-ip-pool.dto';

export class UpdateIpPoolDto extends PartialType(CreateIpPoolDto) {}
