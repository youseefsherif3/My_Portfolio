import { Schema, model, models, type InferSchemaType, Types } from 'mongoose';

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    image: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    github: { type: String, default: '' },
    live: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    highlight: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProjectDocument = InferSchemaType<typeof ProjectSchema> & { _id: Types.ObjectId };

export const Project = models.Project || model('Project', ProjectSchema);
