import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop()
  username: string;

  @Prop()
  firstName: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
