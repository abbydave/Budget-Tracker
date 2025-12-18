import { Schema, model, Document, Types } from "mongoose";

export interface IBudget extends Document {
  userId: Types.ObjectId;
  month: string; // YYYY-MM
  limit: number;
}

const BudgetSchema = new Schema<IBudget>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  month: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true
  }
});

// Prevent duplicate budgets per category per month
BudgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });

export const Budget = model<IBudget>("Budget", BudgetSchema);
