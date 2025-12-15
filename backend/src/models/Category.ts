import { Schema, model, Document, Types } from "mongoose";

export type CategoryType = "expense" | "income";

export interface ICategory extends Document {
  userId: Types.ObjectId;
  name: string;
  type: CategoryType;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["expense", "income"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Category = model<ICategory>("Category", CategorySchema);
