import express from "express";
import {
  createFolder,
  getFolder,
  getAllFolders,
  deleteFolder,
  updateFolder,
} from "../controllers/folder.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authenticate);

// Folder CRUD Operation
router.post("/", createFolder);
router.get("/:folderId", getFolder);
router.get("/", getAllFolders);
router.delete("/:folderId", deleteFolder);
router.put("/:folderId", updateFolder);

export default router;
