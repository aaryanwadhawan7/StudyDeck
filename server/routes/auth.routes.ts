import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no authentication needed)
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Protected routes (authentication required)
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;
