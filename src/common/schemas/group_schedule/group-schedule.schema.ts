import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, VirtualType } from 'mongoose';
import { Led } from '../led';
import { Group } from '../group/group.schema';

@Schema({
  toJSON: {
    getters: true,
  },
})
export class GroupSchedule {
  @Prop({ type: Types.ObjectId, ref: Group.name })
  group: Group;

  @Prop({ required: true })
  time: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, default: true })
  status: boolean;
}

export const GroupScheduleSchema = SchemaFactory.createForClass(GroupSchedule);
