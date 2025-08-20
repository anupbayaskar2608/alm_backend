import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppVmDto } from './dto/create-appvm.dto';
import { UpdateAppVmDto } from './dto/update-appvm.dto';
import { AppAndVm, AppAndVmDocument } from './schemas/appvm.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppvmService {
  constructor(
    @InjectModel(AppAndVm.name) private appAndVmModel: Model<AppAndVmDocument>,
  ) {}

  async findAll() {
    return this.appAndVmModel.aggregate([
      { $match: { isDeleted: false } },
      // add $lookup pipelines (applications, users, vmcontainers, etc.)
    ]);
  }

  async create(dto: CreateAppVmDto) {
    const appvm_uuid = uuidv4();

    const mapped_vms = dto.vm_id.map((vm) => ({ vm_id: vm }));

    const created = new this.appAndVmModel({
      AVID: appvm_uuid,
      apm_id: dto.apm_id,
      region: dto.region,
      dept: dto.dept,
      owner_id: dto.owner_id,
      secgrp: dto.secgrp,
      assigndby: dto.assigndby,
      requestID: dto.requestID,
      mapped_vms,
      notes: dto.comments,
    });

    return created.save();
  }

  async findById(id: string) {
    const record = await this.appAndVmModel.findById(id).exec();
    if (!record) throw new NotFoundException('Mapping not found');
    return record;
  }

  async update(id: string, dto: UpdateAppVmDto) {
    const mapped_vms = dto.vm_id_edit?.map((vm) => ({ vm_id: vm }));

    const updated = await this.appAndVmModel.findByIdAndUpdate(
      id,
      {
        apm_id: dto.apm_id,
        region: dto.region,
        dept: dto.dept,
        owner_id: dto.owner_id,
        secgrp: dto.secgrp,
        assigndby: dto.assigndby,
        requestID: dto.requestID,
        mapped_vms,
        notes: dto.comments,
      },
      { new: true },
    );

    if (!updated) throw new NotFoundException('Mapping not found');
    return updated;
  }

  async delete(id: string) {
    const record = await this.appAndVmModel.findById(id);
    if (!record) throw new NotFoundException('Mapping not found');
    await (this.appAndVmModel as any).delete({ _id: id }); // soft delete
    return { message: `${record.apm_id} mapping deleted` };
  }
}
