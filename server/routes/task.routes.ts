import express from "express";
import {
  createTask,
  findTask,
  updateTask,
  deleteTask,
  getTasks,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authenticate);

// Task CRUD Operation
router.post("/", createTask);
router.get("/", getTasks);
router.delete("/:taskId", deleteTask);
router.put("/:taskId", updateTask);
router.get("/", findTask);

export default router;
