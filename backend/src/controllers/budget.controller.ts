import { Request, Response } from "express";
import * as budgetService from "../services/budget.service";

export const createOrUpdateBudget = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || (req as any).user?._id;
  const { categoryId, month, limit } = req.body;

  const budget = await budgetService.upsertBudget({
    userId,
    categoryId,
    month,
    limit,
  });

  res.status(201).json(budget);
};

export const getBudgetsByMonth = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || (req as any).user?._id;
  const { month } = req.params;

  const budgets = await budgetService.getBudgetsByMonth(userId, month);
  res.json(budgets);
};

export const deleteBudget = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || (req as any).user?._id;
  const { id } = req.params;

  await budgetService.deleteBudget(userId, id);
  res.status(204).send();
};
