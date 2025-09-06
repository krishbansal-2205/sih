import mongoose, { Document, Schema, model } from 'mongoose';

export interface IAssessment extends Document {
   clerkId: mongoose.Types.ObjectId;
   testType: string;
   score: number;
}

const assessmentSchema: Schema<IAssessment> = new Schema(
   {
      clerkId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         index: true,
      },
      testType: { type: String, required: true }, // e.g., "Vertical Jump"
      score: { type: Number, required: true },
   },
   { timestamps: true }
);

export default model<IAssessment>('Assessment', assessmentSchema);
