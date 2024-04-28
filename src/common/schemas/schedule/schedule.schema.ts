import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Led } from '../led';

@Schema()
export class Schedule {
  @Prop({ type: Types.ObjectId, ref: Led.name })
  led: Led;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, default: true })
  status: boolean;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
