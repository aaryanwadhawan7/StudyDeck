import express from "express";
import {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authenticate);

// Note CRUD Operation
router.post("/", createNote);
router.get("/", getAllNotes);
router.get("/:noteId", getNote);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

export default router;
