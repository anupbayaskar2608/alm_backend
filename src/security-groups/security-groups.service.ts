import { Injectable } from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityGroup, SecurityGroupDocument } from './schemas/security-group.schema';

@Injectable()
export class SecurityGroupsService {
  constructor(
    @InjectModel(SecurityGroup.name) private securitygroupModel: Model<SecurityGroupDocument>,
  ) {}

  async findAll(): Promise<SecurityGroupDocument[]> {
    return this.securitygroupModel.find({ isDeleted: false }).exec();
  }

  async create(securitygroupData: any): Promise<SecurityGroupDocument> {
    const newSecurityGroup = new this.securitygroupModel(securitygroupData);
    return newSecurityGroup.save();
  }

  async update(id: string, securitygroupData: any): Promise<SecurityGroupDocument> {
    return this.securitygroupModel.findByIdAndUpdate(id, securitygroupData, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.securitygroupModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
  }

  async findById(id: string): Promise<SecurityGroupDocument> {
    return this.securitygroupModel.findById(id).exec();
  }
}