import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type RestDocument = mongoose.HydratedDocument<Rest>;

@ObjectType()
@Schema({ timestamps: true })
export class Rest {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  @Field()
  description: string;

  @Prop()
  @Field({ nullable: true })
  website?: string;

  @Prop({ required: true })
  @Field()
  email: string;

  @Prop({ required: true })
  @Field()
  phone: string;

  @Prop({ required: true })
  @Field(() => ID)
  createdUserId: string;
}

export const RestSchema = SchemaFactory.createForClass(Rest);
