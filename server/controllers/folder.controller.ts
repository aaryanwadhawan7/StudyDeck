/*
Folder
- name (Provide)
- userId: User (Provide)
- parentFolder: Folder: null 
- color : blue color

Routes/Endpoints
- Create a folder
- Retrieve folder
- Update a folder
- Delete a folder
- Retrieve all folder
*/

import { AuthRequest } from "../middleware/auth.middleware";
import { Folder } from "../models/Folder.model";
import { Response } from "express";

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

    res.status(200).json({
      message: "Folder retrieved successfully!",
      folder,
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

    res.json({
      message: "Folders retrieved successfully",
      folders,
    });
  } catch (error) {
    console.error("Get folders error:", error);
    res.status(500).json({ error: error });
  }
};
