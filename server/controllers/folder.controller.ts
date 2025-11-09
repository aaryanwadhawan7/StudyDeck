/*
Folder
- name (Provide)
- userId: User (Provide)
- parentFolder: Folder: null 
- color : blue color

Routes/Endpoints
- Create a folder (Done)
- Retrieve folder (Done)
- Update a folder (Done)
- Delete a folder (Done)
- Retrieve all folder (Done)
*/

import { AuthRequest } from "../middleware/auth.middleware";
import { Folder } from "../models/Folder.model";
import { Response } from "express";
import { Note } from "../models/Note.model";
import mongoose from "mongoose";

export const createFolder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { name, parentFolder, color } = req.body;

    // Validate input from the user
    if (!name) {
      res.status(400).json({
        message: "Folder name is required!",
      });
      return;
    }

    if (parentFolder) {
      // parentFolder is provided
      const folder = await Folder.findOne({ _id: parentFolder, userId });
      // parentFolder validation: This will check whether recursive folders exists ot not
      if (!folder) {
        res.status(400).json({
          message: "Parent Folder doesn't exist!",
        });
        return;
      }
    }

    const currFolder = await Folder.create({
      userId: userId,
      name: name,
      parentFolder: parentFolder || null,
      color: color || "#3B82F6",
    });

    res.status(200).json({
      message: "Folder created successfully!",
      currFolder,
    });
  } catch (error) {
    console.error("Unable to create folder!");
    res.status(400).json({
      error: error,
    });
  }
};

export const getFolder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { folderId } = req.params;

    const folder = await Folder.findOne({ userId, _id: folderId }).populate(
      "parentFolder"
    );
    // populate(): Replace ObjectId with the actual Document

    if (!folder) {
      res.status(400).json({
        message: "Folder didn't exist!",
      });
      return;
    }

    // Optionally: Check the content of the folder
    const notes = await Note.find({ folderId, userId });

    res.status(200).json({
      message: "Folder retrieved successfully!",
      folder,
      noteCount: notes.length,
    });
  } catch (error) {
    console.error("Folder details can't be accessed!", error);
    res.status(400).json({ error: error });
  }
};

export const getAllFolders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    const folders = await Folder.find({ userId })
      .populate("parentFolder")
      .sort({ createdAt: -1 });

    if (!folders) {
      res.status(400).json({
        message: "Folders can't be retrieved!",
      });
      return;
    }

    res.json({
      message: "Folders retrieved successfully",
      folders,
    });
  } catch (error) {
    console.error("Get folders error:", error);
    res.status(500).json({ error: error });
  }
};

export const deleteFolder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { folderId } = req.params;
    const userId = req.userId;

    const notes = await Note.find({ folderId, userId });
    if (notes.length > 0) {
      res.json({
        message: `Folder contain total ${notes.length} notes. Kindly review before deleting it!`,
      });
      return;
    }

    // Delete Folder and content inside it
    const folder = await Folder.findOneAndDelete({ _id: folderId, userId });

    if (!folder) {
      res.status(400).json({
        message: "Folder doesn't exist! Please check details of the folder!",
      });
      return;
    }

    res.status(200).json({
      message: "Folder deleted successfully!",
    });
  } catch (error) {
    console.error("Folder can't be deleted!", error);
    res.status(400).json({
      error: error,
    });
  }
};

export const updateFolder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { folderId } = req.params;
    const updateData = req.body;

    // LOGIC 1: Validate parentFolder if being changed
    // Purpose: Prevent circular references and invalid parent folders
    if (updateData.parentFolder) {
      const parent = await Folder.findOne({
        _id: updateData.parentFolder,
        userId,
      });
      if (!parent) {
        res.status(400).json({ error: "Parent folder not found" });
        return;
      }
      // Prevent folder from being its own parent
      if (
        ((parent._id as string) || mongoose.Types.ObjectId).toString() ===
        folderId
      ) {
        res.status(400).json({ error: "Folder cannot be its own parent" });
        return;
      }
    }

    const folder = await Folder.findOneAndUpdate(
      { _id: folderId, userId },
      updateData,
      { new: true }
    );

    if (!folder) {
      res.status(404).json({ error: "Folder not found" });
      return;
    }

    res.json({
      message: "Folder updated successfully",
      folder,
    });
  } catch (error) {
    console.error("Update folder error:", error);
    res.status(400).json({ error: "Failed to update folder" });
  }
};
