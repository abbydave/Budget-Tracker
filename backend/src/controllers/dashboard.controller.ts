import { Request, Response } from 'express';
import * as DashboardService from '../services/dashboard.service';

// Helper to map _id to id
const mapId = (obj: any) => {
  if (!obj) return null;
  const plain = obj.toObject ? obj.toObject() : obj;
  const { _id, ...rest } = plain;
  return { id: _id, ...rest };
};

export const getSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const { month } = req.query;

    if (!month || typeof month !== "string") {
      return res.status(400).json({
        success: false,
        message: "Month is required",
        data: null,
      });
    }

    const summary = await DashboardService.getSummary(userId.toString(), month);

    res.status(200).json({
      success: true,
      message: "Summary fetched successfully",
      data: mapId(summary),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const getCategoryBreakdown = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const { month, type } = req.query;

    if (!month || !type || typeof month !== "string") {
      return res.status(400).json({
        success: false,
        message: "Month and type are required",
        data: null,
      });
    }

    const breakdown = await DashboardService.getCategoryBreakdown(
      userId.toString(),
      month,
      type as string
    );

    const mappedBreakdown = Array.isArray(breakdown)
      ? breakdown.map(mapId)
      : mapId(breakdown);

    res.status(200).json({
      success: true,
      message: "Category breakdown fetched successfully",
      data: mappedBreakdown,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const getSpendingTrends = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start and end dates are required",
        data: null,
      });
    }

    const trends = await DashboardService.getSpendingTrends(
      userId.toString(),
      startDate as string,
      endDate as string
    );

    const mappedTrends = Array.isArray(trends)
      ? trends.map(mapId)
      : mapId(trends);

    res.status(200).json({
      success: true,
      message: "Spending trends fetched successfully",
      data: mappedTrends,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
