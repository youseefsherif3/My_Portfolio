import { Schema, model, models, type InferSchemaType, Types } from 'mongoose';

const CertificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type CertificationDocument = InferSchemaType<typeof CertificationSchema> & {
  _id: Types.ObjectId;
};

export const Certification = models.Certification || model('Certification', CertificationSchema);
