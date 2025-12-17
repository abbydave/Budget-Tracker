import { Router } from "express";
import * as ProfileController from "../controllers/profile.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

// GET /api/profile - Get user profile
router.get("/", ProfileController.getProfile);

// PUT /api/profile - Update user profile
router.put("/", ProfileController.updateProfile);

export default router;