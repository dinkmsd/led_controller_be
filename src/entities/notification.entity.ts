import { BaseEntity } from '@entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Led } from 'src/common/schemas/led';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
  },
})
export class NotificationFirebase extends BaseEntity {
  @Prop({
    type: String,
  })
  title: string;

  @Prop({ type: Types.ObjectId, ref: Led.name })
  led: Led;

  @Prop({
    type: String,
  })
  event: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isRead: boolean;
}

export const NotificationFirebaseSchema =
  SchemaFactory.createForClass(NotificationFirebase);
export type NotificationFirebaseDocument = NotificationFirebase & Document;
