import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

export type ApplicationsDocument = Application & Document;

@Schema()
export class Application {
  @Prop({ required: true })
  application_id: string;

  @Prop({ required: true })
  apm_id: string;

  @Prop({ required: true, minlength: 1, maxlength: 40 })
  application_name: string;

  @Prop({ required: true, minlength: 1, maxlength: 40 })
  application_type: string;

  @Prop({ required: true })
  application_facing_type: string;

  @Prop({ required: true })
  application: string;

  @Prop({ required: true })
  application_priority_type: string;

  @Prop({ maxlength: 300, default: 'NA' })
  notes: string;

  @Prop({ default: () => new Date().toLocaleString() })
  createdAt: string;

  
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
// Add mongoose-delete plugin
ApplicationSchema.plugin(mongooseDelete, {
  deletedAt: true,        // Adds deletedAt field
  deletedBy: true,
//  deletedByType: String,        // Optional: track who deleted
  overrideMethods: 'all', // Makes find() exclude deleted docs by default
});
