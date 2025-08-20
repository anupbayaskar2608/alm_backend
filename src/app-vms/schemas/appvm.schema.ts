import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type AppAndVmDocument = AppAndVm & Document;

@Schema({ timestamps: true })
export class AppAndVm {
  @Prop()
  AVID: string;

  @Prop()
  apm_id: string;

  @Prop()
  owner_id: string;

  @Prop()
  region: string;

  @Prop()
  dept: string;

  @Prop()
  secgrp: string;

  @Prop()
  assigndby: string;

  @Prop()
  requestID: number;

  @Prop({ type: [{ vm_id: String }] })
  mapped_vms: { vm_id: string }[];

  @Prop()
  notes: string;

  @Prop({ default: () => new Date().toLocaleString() })
  createdAt: string;
}

export const AppAndVmSchema = SchemaFactory.createForClass(AppAndVm);
AppAndVmSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
