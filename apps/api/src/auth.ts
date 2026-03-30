import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "./db";
import { signToken } from "./jwt";
import { requireAuth, AuthedRequest } from "./authMiddleware";
import { ensureCsrfCookie, requireCsrf } from "./csrf";

// This auth router defines the login endpoint

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(50)
});

const isProd = process.env.NODE_ENV === "production";

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    }
  });
});

authRouter.get("/csrf", ensureCsrfCookie, (req, res) => {
  return res.json({ ok: true });
});

// helper to be called before /login and /signup sucess
function setSessionCookie(res: any, token: string) {
  res.cookie("pippy_session", token, {
    httpOnly: true,
    secure: isProd,      
    sameSite: "lax",  
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

authRouter.post("/logout", ensureCsrfCookie, requireCsrf, (req, res) => {
  res.clearCookie("pippy_session", { path: "/" });
  return res.json({ ok: true });
});

authRouter.post("/login", ensureCsrfCookie, requireCsrf, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  
  const token = signToken({ id: user.id, role: user.role });

  setSessionCookie(res,token);
  return res.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    }
  });
});

authRouter.post("/signup", ensureCsrfCookie, requireCsrf, async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { email, password, displayName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      displayName,
      role: "playtester"
    }
  });

  const token = signToken({ id: user.id, role: user.role });

  setSessionCookie(res,token);
  return res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    }
  });

  

});
