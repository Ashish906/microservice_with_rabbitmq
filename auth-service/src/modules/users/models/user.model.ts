import { prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false
    },
  },
})
export class User {
  @prop({ _id: true, type: Types.ObjectId, auto: true })
  _id!: string;

  @prop({ required: true, unique: true, type: String })
  email!: string;

  @prop({ required: true, type: String, select: false })
  password!: string;

  @prop({ type: String })
  name?: string;

  @prop({ type: Boolean, default: true })
  is_active: boolean;
}
