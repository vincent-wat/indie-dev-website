import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtUser } from "./jwt";

// This authentication middleware protects routes by requiring a valid token

export type AuthedRequest = Request & { user?: JwtUser };

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  // return error if request does not have authorization header or does not start with "Bearer "
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing auth token" });
  }

  const token = header.slice("Bearer ".length);

  // attach id + role then continues to endpoint if token is valid, otherwise return 401 error (unauthorized)
  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}