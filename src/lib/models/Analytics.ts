import { Schema, model, models, type InferSchemaType, Types } from 'mongoose';

const AnalyticsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type AnalyticsDocument = InferSchemaType<typeof AnalyticsSchema> & { _id: Types.ObjectId };

export const Analytics = models.Analytics || model('Analytics', AnalyticsSchema);
