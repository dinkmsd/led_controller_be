import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  toJSON: {
    getters: true,
  },
})
export class History {
  @Prop({ required: true })
  led: string;

  @Prop({ required: true })
  temp: number;

  @Prop({ required: true })
  humi: number;

  @Prop({ required: true })
  brightness: number;

  @Prop({ required: true })
  dateTime: Date;

  @Prop({ required: true })
  incli: string;

  @Prop({ required: true })
  rsrp: number;

  @Prop({ required: true })
  cellID: number;
}

export const HistorySchema = SchemaFactory.createForClass(History);
