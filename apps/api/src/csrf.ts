import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const isProd = process.env.NODE_ENV === "production";
const cookieDomain = isProd ? ".pippystudios.com" : undefined;

export function ensureCsrfCookie(req: Request, res: Response, next: NextFunction) {
  const existing = (req as any).cookies?.pippy_csrf;
  if (existing) return next();

  const token = crypto.randomBytes(32).toString("hex");

  res.cookie("pippy_csrf", token, {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    domain: cookieDomain,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return next();
}

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  const cookieToken = (req as any).cookies?.pippy_csrf;
  const headerToken = req.get("x-csrf-token");

  if (!cookieToken || !headerToken) {
    return res.status(403).json({ error: "CSRF token missing" });
  }

  if (cookieToken !== headerToken) {
    return res.status(403).json({ error: "CSRF token invalid" });
  }

  return next();
}