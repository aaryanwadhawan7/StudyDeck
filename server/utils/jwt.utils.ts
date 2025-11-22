import jwt from "jsonwebtoken";

// Access Token: Short-lived
// Refreash Token: Long-lived

// Task:
// Generate/Verify Access Token
// Generate/Verify Refreash Token

const JWT_SECRET = process.env.JWT_SECRET || "whiplash_best";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dead_poet_society_canMakeGrownManCry";
const accTokenDur = "15m";
const refTokenDur = "7d";

// payload : userId
export const genAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: accTokenDur });
};

// payload : userId
export const genRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: refTokenDur });
};

export const verifyAccessToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
};
