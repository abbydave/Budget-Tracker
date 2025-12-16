import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  id: Number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
   lastName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = model<IUser>("User", UserSchema);
