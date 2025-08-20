import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IpPoolDocument = IpPool & Document;

@Schema()
export class IpPool {
  @Prop()
  pool_id: string;

  @Prop()
  netLabel: string;

  @Prop()
  IP_poolAddr: string;

  @Prop()
  subnetMask: string;

  @Prop()
  CIDR: string;

  @Prop()
  vlanID: string;

  @Prop()
  gateway: string;

  @Prop()
  noOfHosts: string;

  @Prop()
  notes: string;

  @Prop({ default: false })
  Overlay_Network: boolean;

  // Store structured IPs with keys
  @Prop({ type: [Object], default: [] })
  IP_range: { key: string; value: string }[];


  @Prop({ default: () => new Date().toLocaleString() })
  createdAt: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const IpPoolSchema = SchemaFactory.createForClass(IpPool);
