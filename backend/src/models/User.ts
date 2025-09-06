import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    name: { type: String }
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;
export default model<User>('User', userSchema);