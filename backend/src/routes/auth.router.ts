import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/register - Register a new user
router.post("/register", AuthController.register);

// POST /api/auth/login - Login user
router.post("/login", AuthController.login);

// POST /api/auth/request-otp - Request OTP for password reset
router.post("/request-otp", AuthController.requestOtp);

// PUT /api/auth/password-reset - Reset password
router.put("/password-reset", AuthController.resetPassword);

export default router;
