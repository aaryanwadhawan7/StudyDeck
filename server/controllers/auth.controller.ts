import { Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User.model.js";
import {
  genAccessToken,
  genRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

// Register a new user
export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    // Generate tokens
    const accessToken = genAccessToken((user._id as string).toString());
    const refreshToken = genRefreshToken((user._id as string).toString());

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        theme: user.theme,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login user
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate tokens
    const accessToken = genAccessToken((user._id as string).toString());
    const refreshToken = genRefreshToken((user._id as string).toString());

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        theme: user.theme,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

// Refresh access token
export const refresh = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token is required" });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and check if refresh token matches
    const user = await User.findById(decoded.userId).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({ error: "Invalid refresh token" });
      return;
    }

    // Generate new access token
    const newAccessToken = genAccessToken((user._id as string).toString());

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(401).json({ error: "Invalid refresh token" });
  }
};

// Logout user
export const logout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    // Clear refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

// Get current user info
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ error: "Failed to get user info" });
  }
};
