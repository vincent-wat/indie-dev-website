import { Router } from "express";
import { z } from "zod";
import { prisma } from "./db";
import { requireAuth, AuthedRequest } from "./authMiddleware";

export const bugsRouter = Router();

const createBugSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  stepsToReproduce: z.string().optional(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]).optional()
});

bugsRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = createBugSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const user = req.user!;
  const data = parsed.data;

  const bug = await prisma.bugReport.create({
    data: {
      title: data.title,
      description: data.description,
      stepsToReproduce: data.stepsToReproduce,
      expectedResult: data.expectedResult,
      actualResult: data.actualResult,
      severity: data.severity ?? "medium",
      reporterId: user.id
    }
  });

  return res.status(201).json(bug);
});