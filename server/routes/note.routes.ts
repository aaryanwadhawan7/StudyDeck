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
router.post("/", getAllNotes);
router.post("/:noteId", getNote);
router.post("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

export default router;
