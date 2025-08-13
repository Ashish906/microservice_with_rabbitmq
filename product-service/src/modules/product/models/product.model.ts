import { prop, modelOptions } from '@typegoose/typegoose';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'products',
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false
    },
  },
})
export class Product {
    @prop({ _id: true, type: Types.ObjectId, auto: true })
    _id!: string;

    @prop({ required: true, type: String })
    name!: string;

    @prop({ required: true, type: Number })
    price!: number;

    @prop({ required: true, type: Types.ObjectId })
    owner_id!: string;

    @prop({ type: String, required: false })
    description?: string;
}
