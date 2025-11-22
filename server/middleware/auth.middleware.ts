import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authorization token not provided!" });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({ error: "Token could not be extracted!" });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is undefined!");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };

    if (!decodedToken || !decodedToken.userId) {
      res.status(401).json({ error: "Invalid token!" });
      return;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token has expired!" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token!" });
    } else {
      res.status(500).json({ error: "Internal server error!" });
    }
  }
};
