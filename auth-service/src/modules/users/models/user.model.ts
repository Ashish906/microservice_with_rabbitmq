import { prop, getModelForClass } from '@typegoose/typegoose';
import { Types } from 'mongoose';

class User {
  @prop({ type: String })
  public _id!: Types.ObjectId;

  @prop({ required: true, unique: true, type: String })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ type: String })
  public name?: string;

  @prop({ type: Boolean, default: true })
  public is_active!: boolean;
}

const UserModel = getModelForClass(User, {
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
});

export { User, UserModel };
