import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  clerkId: string;
  testType: 'vertical_jump' | 'shuttle_run' | 'sit_ups';
  score: number;
  aiResults?: {
    jumpHeight?: number;
    sitUpCount?: number;
    runTime?: number;
  };
  cheatFlags?: {
    tamperingDetected?: boolean;
    incorrectMovement?: boolean;
  };
  metadata?: {
    deviceInfo?: string;
    location?: string;
    submittedAt?: Date;
  };
  status?: 'pending' | 'verified' | 'flagged';
  createdAt?: Date;
  updatedAt?: Date;
}

const AiResultsSchema = new Schema(
  {
    jumpHeight: { type: Number },
    sitUpCount: { type: Number },
    runTime: { type: Number },
  },
  { _id: false }
);

const CheatFlagsSchema = new Schema(
  {
    tamperingDetected: { type: Boolean, default: false },
    incorrectMovement: { type: Boolean, default: false },
  },
  { _id: false }
);

const MetadataSchema = new Schema(
  {
    deviceInfo: { type: String },
    location: { type: String },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AssessmentSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true },
    testType: { 
      type: String, 
      required: true, 
      enum: ['vertical_jump', 'shuttle_run', 'sit_ups'] 
    },
    score: { type: Number, required: true },
    aiResults: { type: AiResultsSchema, default: {} },
    cheatFlags: { type: CheatFlagsSchema, default: {} },
    metadata: { type: MetadataSchema, default: {} },
    status: { type: String, enum: ['pending', 'verified', 'flagged'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);