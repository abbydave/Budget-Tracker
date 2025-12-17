import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  id: Number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  otp?: string | null;
  otpExpiry?: Number | null;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = model<IUser>("User", UserSchema);
