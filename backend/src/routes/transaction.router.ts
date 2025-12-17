import { Router } from "express";
import * as TransactionController from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

// POST /api/transactions - Create a transaction
router.post("/", TransactionController.create);

// GET /api/transactions - Get transactions with filters
router.get("/", TransactionController.getAll);

// PUT /api/transactions/:id - Update a transaction
router.put("/:id", TransactionController.update);

// DELETE /api/transactions/:id - Delete a transaction
router.delete("/:id", TransactionController.remove);

export default router;