import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SecurityGroupDocument = SecurityGroup & Document;

@Schema({ timestamps: true })
export class SecurityGroup {
  @Prop({ required: true })
  security_group_name: string;

  // Now storing an array of strings for service names
  @Prop({ type: [String], required: false })
  service_names: string[];

  @Prop({ default: 'NA' })
  notes: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const SecurityGroupSchema = SchemaFactory.createForClass(SecurityGroup);