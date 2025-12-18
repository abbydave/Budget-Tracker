import { Router } from "express";
import * as CategoryController from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

// POST /api/categories - Create a category
router.post("/", CategoryController.create);

// GET /api/categories - Get all categories 
router.get("/", CategoryController.getAll);

// PATCH /api/categories/:id - Update category
router.patch("/:id", CategoryController.update);

// DELETE /api/categories/:id - Delete category
router.delete("/:id", CategoryController.remove);

export default router;
