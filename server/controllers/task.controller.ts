/*
Task: default
- title (Provide)
- description : ""
- noteId : Note : null
- userId : User (Provide)
- status : "todo"
- priority : "medium"
- dueDate : null
- completedAt : null

Routes/Endpoints:
- Create task
- Retrieve task
- Update task
- Delete task
- List all task
*/

import { Task } from "../models/Task.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";

// 1) Create task
export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title: title,
      userId,
      description: description || "",
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDate || null,
    });

    if (!task) {
      res.status(400).json({
        message: "Unable to create task!",
      });
    }

    res.status(200).json({
      message: "Task created successfully!",
      task,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

// 2) Retrieve task
export const findTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    const task = await Task.findOne({ userId });

    if (!task) {
      res.status(400).json({
        message: "Unable to retrieve task!",
      });
      return;
    }

    res.status(200).json({
      message: "Task retrieved successfully!",
      task,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

// 3) Update task
export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const updatedTask = req.body;
    const { taskId } = req.params;

    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        userId,
      },
      updatedTask,
      { new: true }
    );

    if (!task) {
      res.status(400).json({
        message: "Unable to update the task!",
      });

      res.status(200).json({
        message: "Task updated successfully!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

// 4) Delete task
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const { taskId } = req.params;

    const task = await Task.findOneAndDelete({ _id: userId, taskId });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

// 5) List all task
export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    const tasks = await Task.find({ userId }).sort({
      dueDate: 1,
      createdAt: -1,
    });

    res.json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
