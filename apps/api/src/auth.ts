import { Router } from "express";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "./db";
import { signToken } from "./jwt";
import { requireAuth, AuthedRequest } from "./authMiddleware";
import { ensureCsrfCookie, requireCsrf } from "./csrf";
import { hashToken, generateResetToken } from "./passwordReset";

// This auth router defines the login endpoint

export const authRouter = Router();

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(50)
});

const forgotSchema = z.object({ 
  email: z.email() 
});

const resetSchema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8)
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

authRouter.post("/forgot-password", ensureCsrfCookie, requireCsrf, async (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { email } = parsed.data;

  // Always return success message to avoid account enumeration
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ ok: true });

  const token = generateResetToken();
  const tokenHash = hashToken(token);

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt
    }
  });

  const webBase = process.env.WEB_BASE_URL ?? "http://localhost:3000";
  const resetLink = `${webBase}/reset-password?token=${token}`;

  // Production: send email. Dev: log link.
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.FROM_EMAIL ?? "no-reply@pippystudios.com";

    await resend.emails.send({
      from,
      to: email,
      subject: "Reset your Pippy Studios password",
      html: `
        <p>Someone requested a password reset for your Pippy Studios account.</p>
        <p><a href="${resetLink}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      `
    });
  } else {
    console.log("[DEV] Password reset link:", resetLink);
  }

  return res.json({ ok: true });
});

authRouter.post("/reset-password", ensureCsrfCookie, requireCsrf, async (req, res) => {
  const parsed = resetSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

  const { token, newPassword } = parsed.data;
  const tokenHash = hashToken(token);

  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!record) return res.status(400).json({ error: "Invalid or expired token" });

  if (record.usedAt) return res.status(400).json({ error: "Token already used" });
  if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ error: "Token expired" });

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash }
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() }
    })
  ]);

  return res.json({ ok: true });
});