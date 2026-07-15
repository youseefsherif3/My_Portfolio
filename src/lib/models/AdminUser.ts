import { Schema, model, models, type InferSchemaType, Types } from 'mongoose';

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export type AdminUserDocument = InferSchemaType<typeof AdminUserSchema> & { _id: Types.ObjectId };

export const AdminUser = models.AdminUser || model('AdminUser', AdminUserSchema);
