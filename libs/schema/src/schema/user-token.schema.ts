import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum Source {
  Google = 'Google',
  Facebook = 'Facebook',
}

export type UserTokenDocument = HydratedDocument<UserToken>;

@Schema({
  timestamps: true,
})
export class UserToken {
  @Prop({ required: true })
  userID: string;

  @Prop({ required: true })
  emailID: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true, enum: Source })
  source: Source;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
