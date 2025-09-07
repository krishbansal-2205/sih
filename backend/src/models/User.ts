import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
   clerkId: string;
   email: string;
   name?: string;
}

const userSchema: Schema<IUser> = new Schema(
   {
      clerkId: { type: String, required: true, unique: true, index: true },
      email: { type: String, required: true, index: true },
      name: { type: String },
   },
   { timestamps: true }
);

export default model<IUser>('User', userSchema);
