import { Schema, model, models, type InferSchemaType } from 'mongoose';

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    cvUrl: { type: String, default: '/cv.pdf' },
  },
  { timestamps: true }
);

export type SiteSettingsDocument = InferSchemaType<typeof SiteSettingsSchema>;
export const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema);
