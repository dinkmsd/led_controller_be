import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class History {
  @Prop({ required: true })
  ledID: string;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  humidity: number;

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
