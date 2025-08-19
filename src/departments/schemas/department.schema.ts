import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true })
  department_name: string;

  @Prop([
    {
      user_id: { type: String, required: true },
      key: { type: String, enum: ['Department_Head', 'Member'], required: true },
    },
  ])
  dept_members: { user_id: string; key: string }[];

  @Prop()
  notes: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);