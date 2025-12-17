import { Request, Response } from 'express';
import * as DashboardService from '../services/dashboard.service';

export const getSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { month } = req.query;

    if (!month || typeof month !== "string") {
      return res.status(400).json({ message: "Month is required" });
    }

    const summary = await DashboardService.getSummary(userId.toString(), month);

    res.status(200).json({
      status: 'success',
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryBreakdown = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { month, type } = req.query;

    if (!month || !type || typeof month !== "string") {
      return res.status(400).json({ message: "Month and type are required" });
    }

    const breakdown = await DashboardService.getCategoryBreakdown(
      userId.toString(),
      month,
      type as string
    );

    res.status(200).json({
      status: 'success',
      data: breakdown,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpendingTrends = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and end dates are required" });
    }

    const trends = await DashboardService.getSpendingTrends(
      userId.toString(),
      startDate as string,
      endDate as string
    );

    res.status(200).json({
      status: 'success',
      data: trends,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};