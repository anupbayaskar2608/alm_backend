import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Region, RegionDocument } from './schemas/region.schema';

@Injectable()
export class RegionsService {
  constructor(
    @InjectModel(Region.name) private regionModel: Model<RegionDocument>,
  ) {}

  async findAll(): Promise<RegionDocument[]> {
    return this.regionModel.find({ isDeleted: false }).exec();
  }

  async create(regionData: any): Promise<RegionDocument> {
    const newRegion = new this.regionModel(regionData);
    return newRegion.save();
  }

  async update(id: string, regionData: any): Promise<RegionDocument> {
    return this.regionModel.findByIdAndUpdate(id, regionData, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.regionModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
  }

  async findById(id: string): Promise<RegionDocument> {
    return this.regionModel.findById(id).exec();
  }
}