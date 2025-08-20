import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type WorkloadDocument = Workload & Document;

@Schema({ timestamps: true })
export class Workload {
  @Prop()
  vm_id: string;

  @Prop()
  vm_name: string;

  @Prop()
  host_ip: string;

  @Prop()
  vm_guest_os: string;

  @Prop()
  vm_network: string;

  @Prop({ type: Array, default: [] })
  nic_ids: { id: string; ip: string; netLabel: string }[];

  @Prop()
  NICs: number;

  @Prop()
  notes: string;

  @Prop({ default: () => new Date().toLocaleString() })
  createdAt: string;
}

export const WorkloadSchema = SchemaFactory.createForClass(Workload);

// add soft-delete plugin
WorkloadSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
