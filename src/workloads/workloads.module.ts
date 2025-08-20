import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Workload, WorkloadSchema } from './schemas/workload.schema';
import { WorkloadService } from './workload.service';
import { WorkloadController } from './workload.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Workload.name, schema: WorkloadSchema }]),
  ],
  controllers: [WorkloadController],
  providers: [WorkloadService],
  exports: [WorkloadService],
})
export class WorkloadsModule {}
