import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsMilitaryTime, IsNumber, IsString } from 'class-validator';

@Schema()
export class Schedule {
  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, default: true })
  status: boolean;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
