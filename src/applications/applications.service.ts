// src/application/application.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Application, ApplicationsDocument } from './schemas/applications.schema';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<ApplicationsDocument> & {
      deleteById: (id: string) => Promise<any>;
      restore: (filter: any) => Promise<any>;
      findWithDeleted: () => Promise<ApplicationsDocument[]>;
    },
  ) {}

  async findAll() {
    const applications = await this.applicationModel.find().exec();
    const countedApplications = await this.applicationModel.countDocuments();
    return { applications, countedApplications };
  }

  async findById(id: string) {
    const application = await this.applicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  private async isApplicationExists(apm_id: string): Promise<boolean> {
    const existing = await this.applicationModel.findOne({ apm_id });
    return !!existing;
  }

  async create(data: Partial<Application>) {
    if (!data.apm_id || !data.application_name || !data.application_type || !data.application_facing_type) {
      throw new BadRequestException('Missing required fields');
    }

    if (await this.isApplicationExists(data.apm_id)) {
      throw new BadRequestException('Application already exists');
    }

    const application = new this.applicationModel({
      application_id: uuidv4(),
      ...data,
    });

    return application.save();
  }

  async update(id: string, data: Partial<Application>) {
    if (
      !data.application_name &&
      !data.application_type &&
      !data.application &&
      !data.application_facing_type &&
      !data.application_priority_type &&
      !data.notes
    ) {
      throw new BadRequestException('Please provide valid data to update the application');
    }

    const updated = await this.applicationModel.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      throw new NotFoundException('Application not found');
    }
    return updated;
  }
   async delete(id: string) {
  const app = await this.applicationModel.findById(id);
  if (!app) {
    throw new NotFoundException('Application not found');
  }

  

  // Soft delete the record
  await (this.applicationModel as any).delete(
  { _id: id }
);

  return { message: `Application is deleted` };
} 

/* async delete(id: string, username: string) {
  const app = await this.applicationModel.findById(id);
  if (!app) {
    throw new NotFoundException('Application not found');
  }

   console.log('Deleting by:', username); // debug

  // Soft delete the record
  await (this.applicationModel as any).delete(
  { _id: id },
  username  // 👈 gets saved in deletedBy
);

  return { message: `Application soft deleted by ${username}.` };
} */

async restore(id: string) {
  const restored = await this.applicationModel.restore({ _id: id });
  if (!restored) {
    throw new NotFoundException('Application not found or not deleted');
  }

  // Clear deletedBy on restore
  await this.applicationModel.updateOne({ _id: id }, { $unset: { deletedBy: '' } });

  return { message: `Application restored successfully.` };
}

}
