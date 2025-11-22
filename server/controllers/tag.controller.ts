import { Response } from "express";
import { Tag } from "../models/Tag.model.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const createTag = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { name, color } = req.body;

    if (!name) {
      res.status(400).json({ error: "Tag name is required" });
      return;
    }

    // Check if tag with same name already exists for this user
    // Purpose: Prevent duplicate tags (schema has unique index on userId + name)
    const existingTag = await Tag.findOne({ userId, name });
    if (existingTag) {
      res.status(400).json({ error: "Tag with this name already exists" });
      return;
    }

    // Create tag
    const tag = await Tag.create({
      userId,
      name,
      color: color || "#10B981",
    });

    res.status(201).json({
      message: "Tag created successfully",
      tag,
    });
  } catch (error) {
    console.error("Create tag error:", error);
    res.status(400).json({ error: "Failed to create tag" });
  }
};

export const getTags = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    // Fetch all tags for user
    // Purpose: Show all available tags user can use
    const tags = await Tag.find({ userId }).sort({ createdAt: -1 });

    res.json({
      message: "Tags retrieved successfully",
      tags,
    });
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({ error: "Failed to retrieve tags" });
  }
};

export const getTag = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { tagId } = req.params;

    // Find tag by ID AND userId
    const tag = await Tag.findOne({ _id: tagId, userId });

    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    // Fetch all notes and tasks with this tag
    // Purpose: Show all items tagged with this tag
    const { Note } = await import("../models/Note.model.js");
    const { Task } = await import("../models/Task.model.js");

    const notes = await Note.find({ tags: tagId, userId });
    const tasks = await Task.find({ tags: tagId, userId });

    res.json({
      message: "Tag retrieved successfully",
      tag,
      itemCount: notes.length + tasks.length,
      notes,
      tasks,
    });
  } catch (error) {
    console.error("Get tag error:", error);
    res.status(400).json({ error: "Failed to retrieve tag" });
  }
};

export const updateTag = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { tagId } = req.params;
    const { name, color } = req.body;

    // If name is being changed, check for duplicates
    if (name) {
      const existingTag = await Tag.findOne({
        userId,
        name,
        _id: { $ne: tagId },
      });
      if (existingTag) {
        res
          .status(400)
          .json({ error: "Another tag with this name already exists" });
        return;
      }
    }

    const tag = await Tag.findOneAndUpdate(
      { _id: tagId, userId },
      { name, color },
      { new: true }
    );

    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    res.json({
      message: "Tag updated successfully",
      tag,
    });
  } catch (error) {
    console.error("Update tag error:", error);
    res.status(400).json({ error: "Failed to update tag" });
  }
};

export const deleteTag = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { tagId } = req.params;

    // Remove tag from all notes and tasks
    // Purpose: Clean up references before deletion
    const { Note } = await import("../models/Note.model.js");
    const { Task } = await import("../models/Task.model.js");

    await Note.updateMany({ userId }, { $pull: { tags: tagId } });
    await Task.updateMany({ userId }, { $pull: { tags: tagId } });

    // Delete tag
    const tag = await Tag.findOneAndDelete({ _id: tagId, userId });

    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    res.json({
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Delete tag error:", error);
    res.status(400).json({ error: "Failed to delete tag" });
  }
};
