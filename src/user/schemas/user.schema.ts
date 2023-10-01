import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop()
  username: string;

  @Prop()
  firstName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
