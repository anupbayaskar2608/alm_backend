import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Service extends Document {
  @Prop({ required: true })
  service_name: string;

  @Prop({ required: true })
  ports: number;

  @Prop({ required: true })
  protocols: string;

    @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  notes: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
