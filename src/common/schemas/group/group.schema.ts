import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Led } from '../led';

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
}

export const GroupSchema = SchemaFactory.createForClass(Group);
