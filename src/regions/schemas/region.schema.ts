import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RegionDocument = Region & Document;

@Schema({ timestamps: true })
export class Region {
  @Prop({ required: true })
  region_name: string;

  @Prop({ required: true })
  postal_address: string;

  @Prop({ default: 'NA' })
  notes: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const RegionSchema = SchemaFactory.createForClass(Region);