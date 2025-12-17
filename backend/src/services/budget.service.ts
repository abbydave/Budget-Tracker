import { Budget } from "../models/Budget";
import { Types } from "mongoose";

interface UpsertBudgetInput {
  userId: string;
  categoryId: string;
  month: string;
  limit: number;
}

export const upsertBudget = async ({
  userId,
  categoryId,
  month,
  limit
}: UpsertBudgetInput) => {
  return Budget.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      categoryId: new Types.ObjectId(categoryId),
      month
    },
    { limit },
    { new: true, upsert: true }
  );
};

export const getBudgetsByMonth = async (
  userId: string,
  month: string
) => {
  return Budget.find({
    userId: new Types.ObjectId(userId),
    month
  }).populate("categoryId");
};

export const deleteBudget = async (userId: string, budgetId: string) => {
  return Budget.deleteOne({
    _id: new Types.ObjectId(budgetId),
    userId: new Types.ObjectId(userId)
  });
};
