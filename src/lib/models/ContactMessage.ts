import { Schema, model, models, type InferSchemaType, Types } from 'mongoose';

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type ContactMessageDocument = InferSchemaType<typeof ContactMessageSchema> & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const ContactMessage =
  models.ContactMessage || model('ContactMessage', ContactMessageSchema);
