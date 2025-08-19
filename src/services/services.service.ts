import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './schemas/services.Schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: Model<Service>,
  ) {}

  async findAll() {
    // Only return services that are NOT deleted
    const services = await this.serviceModel.find({ isDeleted: false }).exec();
    return { services };
  }

  async findOne(id: string) {
    // Check both ID and isDeleted
    const service = await this.serviceModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async create(createServiceDto: CreateServiceDto) {
    const newService = new this.serviceModel(createServiceDto);
    return await newService.save();
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const updated = await this.serviceModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false }, // Ensure not deleted
        updateServiceDto,
        { new: true }
      )
      .exec();
    if (!updated) {
      throw new NotFoundException(`Service with ID ${id} not found or deleted`);
    }
    return updated;
  }

  // Soft delete method
  async delete(id: string): Promise<void> {
    const deleted = await this.serviceModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
    if (!deleted) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }
}
