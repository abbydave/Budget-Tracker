import { Router } from "express";
import {
  createOrUpdateBudget,
  getBudgetsByMonth,
  deleteBudget
} from "../controllers/budget.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

//All budget routes require auth for access
router.use(authenticate);

//Create or update a budget
router.post("/", createOrUpdateBudget);

//Get budgets for a specific month (YYYY-MM)
router.get("/:month", getBudgetsByMonth);

//Delete a budget
router.delete("/:id", deleteBudget);

export default router;
