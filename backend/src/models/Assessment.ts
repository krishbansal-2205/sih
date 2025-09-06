import { Schema, model, InferSchemaType } from 'mongoose';

const assessmentSchema = new Schema(
  {
    clerkId: { type: String, required: true, index: true },
    testType: { type: String, required: true }, // e.g., "Vertical Jump"
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

export type Assessment = InferSchemaType<typeof assessmentSchema>;
export default model<Assessment>('Assessment', assessmentSchema);