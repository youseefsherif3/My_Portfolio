import { Schema, model, models, type InferSchemaType } from 'mongoose';

const ExperienceSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    period: { type: String, required: true },
    description: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ExperienceDocument = InferSchemaType<typeof ExperienceSchema>;

export const Experience = models.Experience || model('Experience', ExperienceSchema);
