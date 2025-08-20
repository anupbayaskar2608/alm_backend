import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workload, WorkloadDocument } from './schemas/workload.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class WorkloadService {
  constructor(
    @InjectModel(Workload.name) private workloadModel: Model<WorkloadDocument>,
  ) {}

  async findAll(): Promise<{ workloads: Workload[]; count: number }> {
    const workloads = await this.workloadModel.find({ deleted: false }).exec();
    const count = await this.workloadModel.countDocuments({ deleted: false });
    return { workloads, count };
  }

  async create(data: any): Promise<Workload> {
    const exists = await this.workloadModel.findOne({ vm_name: data.vm_name, deleted: false });
    if (exists) {
      throw new BadRequestException('Workload already exists');
    }

    // TODO: inject generatePrefixId instead of direct call
    const newWorkload = new this.workloadModel({
      vm_id: data.vm_id, // call generatePrefixId('VM', 4, this.workloadModel, 'vm_id')
      vm_name: data.vm_name,
      host_ip: data.host_ip,
      vm_guest_os: data.vm_guest_os,
      vm_network: data.vm_network,
      NICs: data.nics,
      nic_ids: data.nic_ids,
      notes: data.notes,
    });

    return newWorkload.save();
  }

  async update(id: string, updateData: any): Promise<Workload> {
    const workload = await this.workloadModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!workload) throw new NotFoundException('Workload not found');
    return workload;
  }

  async delete(id: string): Promise<{ message: string }> {
    const workload = await this.workloadModel.findById(id);
    if (!workload) throw new NotFoundException('Workload not found');

    await (this.workloadModel as any).delete({ _id: new ObjectId(id) });
    return { message: `${workload.vm_name} workload has been deleted.` };
  }

  async getNicDataByVMid(vmId: string): Promise<Workload | null> {
    return this.workloadModel.findOne({ vm_id: vmId }).exec();
  }
}
