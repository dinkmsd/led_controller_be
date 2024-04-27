import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Schedule } from '../schedule';
import { Type } from 'class-transformer';
import { History } from '../history';

@Schema()
export class Led {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: true })
  status: boolean;

  @Prop({ require: true })
  lat: number;

  @Prop({ require: true })
  lon: number;

  @Prop()
  temp: number;

  @Prop()
  humi: number;

  @Prop()
  brightness: number;

  @Prop()
  incli: string;

  @Prop()
  x: string;

  @Prop()
  y: string;

  @Prop()
  z: string;

  @Prop()
  rsrp: number;

  @Prop()
  cellID: number;

  @Prop({ default: Date.now() })
  createAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: History.name }] })
  histories: History[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Schedule.name }],
  })
  schedules: Schedule[];
}

export const LedSchema = SchemaFactory.createForClass(Led);
