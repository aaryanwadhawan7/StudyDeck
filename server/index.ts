import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "../server/routes/auth.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: process.env.VITE_API_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Backend is running",
  });
});

app.use("/api/auth", authRoutes);

app.use((err: Error, req: Request, res: Response) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Application is running on port ${port}`);
    });
  } catch (err) {
    console.log("Failed to start the server!", err);
  }
};

startServer();
