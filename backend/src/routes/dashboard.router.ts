import { Router } from "express";
import * as DashboardController from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

// GET /api/dashboard/summary?month=2025-03 - Get income/expense summary
router.get("/summary", DashboardController.getSummary);

// GET /api/dashboard/categories?month=2025-03&type=expense - Get category breakdown
router.get("/categories", DashboardController.getCategoryBreakdown);

// GET /api/dashboard/trends?startDate=2025-03-01&endDate=2025-03-31 - Get spending trends
router.get("/trends", DashboardController.getSpendingTrends);

export default router;
