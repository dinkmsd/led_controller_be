import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Schedule } from '../schedule';
import { History } from '../history';
import { Group } from '../group';

@Schema({
  toJSON: {
    getters: true,
  },
})
export class Led {
  @Prop({ type: Types.ObjectId, ref: Group.name })
  group: Group;

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

  @Prop({ type: [{ type: Types.ObjectId, ref: History.name }] })
  histories: History[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'schedules' }],
  })
  schedules: Schedule[];
}

export const LedSchema = SchemaFactory.createForClass(Led);
