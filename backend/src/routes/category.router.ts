import { Router } from "express";
import * as CategoryController from "../controllers/category.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

// POST /api/categories - Create a category
router.post("/", CategoryController.create);

// GET /api/categories - Get all categories 
router.get("/", CategoryController.getAll);

export default router;
