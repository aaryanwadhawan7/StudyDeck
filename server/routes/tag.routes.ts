import express from "express";
import {
  createTag,
  getTags,
  getTag,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All tag routes require authentication
router.use(authenticate);

// Tag CRUD Operation
router.post("/", createTag); // Create tag
router.get("/", getTags); // Get all tags
router.get("/:tagId", getTag); // Get single tag (with items)
router.put("/:tagId", updateTag); // Update tag
router.delete("/:tagId", deleteTag); // Delete tag

export default router;
