import { Router } from "express";
import { z } from "zod";
import { prisma } from "./db";
import { requireAuth, AuthedRequest } from "./authMiddleware";

// This bugs router defines the playtest bug report endpoints

export const bugsRouter = Router();

// Request body should contain title and description. The rest of the options are optional.
const createBugSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  stepsToReproduce: z.string().optional(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]).optional()
});

// Define endpoint with authorization middleware happening beforehand
bugsRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  // Compare JSON with schema. If parsing unsucessful, return 400 error 
  const parsed = createBugSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // extract user {id, role} + the actual data from a bug report {title, description}
  const user = req.user!;
  const data = parsed.data;

  // insert into database
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

  // returns success response (201 = Created) and the bug report back to the client
  return res.status(201).json(bug);
});