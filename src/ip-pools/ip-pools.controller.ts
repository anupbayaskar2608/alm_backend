import {Controller,Get,Post,Body,Param,Delete,Put,} from '@nestjs/common';
import { IpPoolsService } from './ip-pools.service';
import { CreateIpPoolDto } from './dto/create-ip-pool.dto';
import { UpdateIpPoolDto } from './dto/update-ip-pool.dto';

@Controller('ip-pools')
export class IpPoolsController {
  constructor(private readonly ipPoolsService: IpPoolsService) {}

  @Get()
  async findAll() {
    return this.ipPoolsService.findAll();
  }

  @Post()
  async create(@Body() ipPoolData: any) {
    return this.ipPoolsService.create(ipPoolData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() ipPoolData: any) {
    return this.ipPoolsService.update(id, ipPoolData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.ipPoolsService.delete(id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.ipPoolsService.findById(id);
  }
}