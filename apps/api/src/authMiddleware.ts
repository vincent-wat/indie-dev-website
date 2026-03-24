import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtUser } from "./jwt";

// This authentication middleware protects routes by requiring a valid token

export type AuthedRequest = Request & { user?: JwtUser };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const tokenFromHeader = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
  const tokenFromCookie = (req as any).cookies?.pippy_session;

  const token = tokenFromCookie || tokenFromHeader;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  
  // attach id + role then continues to endpoint if token is valid, otherwise return 401 error (unauthorized)
  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}