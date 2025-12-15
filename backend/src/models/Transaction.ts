import { Schema, model, Document, Types } from "mongoose";

export type TransactionType = "expense" | "income";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  type: TransactionType;
  amount: number;
  note?: string;
  date: Date;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  type: {
    type: String,
    enum: ["expense", "income"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  note: {
    type: String
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Transaction = model<ITransaction>("Transaction", TransactionSchema);
