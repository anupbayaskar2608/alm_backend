import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { WorkloadService } from './workload.service';
import { CreateWorkloadDto } from './dto/create-workload.dto';
import { UpdateWorkloadDto } from './dto/update-workload.dto';
import { DeleteWorkloadDto } from './dto/delete-workload.dto';

@Controller('workloads')
export class WorkloadController {
  constructor(private readonly workloadService: WorkloadService) {}

  @Get()
  async getAll() {
    return this.workloadService.findAll();
  }

  @Post()
  async create(@Body() data: CreateWorkloadDto) {
    return this.workloadService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateWorkloadDto) {
    return this.workloadService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Body() data: DeleteWorkloadDto) {
    return this.workloadService.delete(id);
  }

  @Post('nic-data')
  async getNicData(@Body('id') vmId: string) {
    return this.workloadService.getNicDataByVMid(vmId);
  }
}
