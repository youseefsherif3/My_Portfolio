import { Schema, model, models, type InferSchemaType, Types } from 'mongoose';

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 0, max: 100 },
    category: { type: String, required: true, trim: true },
    icon: { type: String, default: 'CpuChipIcon' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type SkillDocument = InferSchemaType<typeof SkillSchema> & { _id: Types.ObjectId };

export const Skill = models.Skill || model('Skill', SkillSchema);
