/*
Note: 
- title (Provide)
- content (Provide)
- userId : User
- tags : Tag : [] (Provide)
- folderId : Folder (Provide)
- reviewCount
- lastReviewed 
- nextReviewed 
- isPinned

Routes/Endpoints:
- Create note
- Get all notes
- Retrieve a note
- Get note
- Update note
- Delete note
*/

import { Note } from "../models/Note.model";
import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";

// 1) Create Note
export const createNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { title, content, folderId, tags } = req.body;

    if (!title) {
      res.status(401).json({
        error: "Title is not defined!",
      });
      return;
    }

    const note = await Note.create({
      title: title,
      content: content || "",
      userId,
      tags: tags || [],
      folderId: folderId || null,
    });

    res.status(201).json({
      message: "Note created successfully!",
      note,
    });
  } catch (error) {
    res.status(401).json({
      message: "Unable to create a note!",
      error: error,
    });
  }
};

// 2) Get all Notes (for current user)
export const getAllNotes = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // verify userId
    const userId = req.userId;

    const notes = await Note.find({ userId })
      .populate("folderId")
      .populate("tags")
      .sort({ createdAt: -1 });

    res.status(201).json({
      message: "Retrieved Notes Successfully!",
      notes,
    });
  } catch (error) {
    res.status(401).json({
      message: "Notes can't be retrieved!",
      error: error,
    });
  }
};

// 3) Get single note
export const getNote = async (req: AuthRequest, res: Response) => {
  try {
    // noteId and userId
    const { noteId } = req.params;
    const userId = req.userId;

    if (!noteId) {
      res.status(401).json({
        message: "noteId is not provided!",
      });
    }

    // Filter the note by noteId
    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      res.status(404).json({
        message: "No note available with given noteId!",
      });
      return;
    }

    res.status(200).json({
      message: `Accessed note with ${noteId}!`,
      note,
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
};

// 4) Update a note
export const updateNote = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Find the note
    const { noteId } = req.params;
    const userId = req.userId;
    const updatedNote = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      updatedNote,
      {
        new: true,
      }
    )
      .populate("folderId")
      .populate("tags");

    if (!note) {
      res.status(400).json({
        message: "Unable to update note!",
      });
      return;
    }

    res.status(200).json({
      message: "Note found and updated!",
      note,
    });
  } catch (error) {
    res.json({
      error: error,
    });
  }
};

// 5) Delete a note
export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { noteId } = req.params;
    const userId = req.userId;

    const note = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
};
