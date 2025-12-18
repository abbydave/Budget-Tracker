import { Request, Response } from "express";
import * as budgetService from "../services/budget.service";

// Helper to map _id -> id
const mapId = (obj: any) => {
  if (!obj) return null;
  const plain = obj.toObject ? obj.toObject() : obj;
  const { _id, ...rest } = plain;
  return { id: _id, ...rest };
};

export const createOrUpdateBudget = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || (req as any).user?._id;
  const { month, limit } = req.body;

  if (!month || limit === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
      data: null,
    });
  }

  const budget = await budgetService.upsertBudget({
    userId,
    month,
    limit,
  });

  res.status(201).json({
    success: true,
    message: "Budget saved successfully",
    data: mapId(budget),
  });
};

export const getBudgetsByMonth = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || (req as any).user?._id;
  const { month } = req.params;

  const budgets = await budgetService.getBudgetsByMonth(userId, month);

  const formattedBudgets = budgets.map(mapId);

  res.json({
    success: true,
    message: "Budgets fetched successfully",
    data: formattedBudgets,
  });
};

export const deleteBudget = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || (req as any).user?._id;
  const { id } = req.params;

  await budgetService.deleteBudget(userId, id);

  res.status(200).json({
    success: true,
    message: "Budget deleted successfully",
    data: null,
  });
};
