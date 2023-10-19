import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Period {
  @Prop({ required: true })
  openTime: string;

  @Prop({ required: true })
  closeTime: string;
}

const PeriodSchema = SchemaFactory.createForClass(Period);

@Schema({ _id: false })
export class BusinessTime {
  @Prop({ required: true })
  isOpenAllDay: boolean;

  @Prop({ required: true })
  isClosed: boolean;

  @Prop({ type: [PeriodSchema], default: [] })
  period: Period[];
}

export const BusinessTimeSchema = SchemaFactory.createForClass(BusinessTime);
