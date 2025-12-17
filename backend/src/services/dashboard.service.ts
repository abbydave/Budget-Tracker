import { Types } from "mongoose";
import { Transaction } from "../models/Transaction";

const getMonthRange = (month: string) => {
  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  return { start, end };
};

interface SummaryResult {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const getSummary = async (userId: string, month: string): Promise<SummaryResult> => {
  const { start, end } = getMonthRange(month);

  const transactions = await Transaction.find({
    userId: new Types.ObjectId(userId),
    date: { $gte: start, $lt: end },
  });

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    if (tx.type === "income") totalIncome += tx.amount;
    if (tx.type === "expense") totalExpense += tx.amount;
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

export const getCategoryBreakdown = async (
  userId: string,
  month: string,
  type: string
) => {
  const { start, end } = getMonthRange(month);

  const breakdown = await Transaction.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        type,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: "$categoryId",
        total: { $sum: "$amount" },
      },
    },
  ]);

  return breakdown;
};

export const getSpendingTrends = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  const trends = await Transaction.aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        type: "expense",
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return trends;
};