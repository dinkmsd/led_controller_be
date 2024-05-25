import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Led } from '../led';
import { GroupSchedule } from '../group_schedule/group-schedule.schema';

@Schema({
  toJSON: {
    getters: true,
  },
})
export class Group {
  @Prop({ required: true })
  groupName: string;

  @Prop({ default: Date.now() })
  createAt: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'leds' }],
  })
  leds: Led[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'schedules' }],
  })
  schedules: GroupSchedule[];

  @Prop({ default: true })
  status: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
