import { Router } from "express";
import { z } from "zod";
import { prisma } from "./db";
import { requireAuth, AuthedRequest } from "./authMiddleware";

// This bugs router defines the playtest bug report endpoints

function requireStaff(req: AuthedRequest, res: any, next: any) {
  const role = req.user?.role;
  if (role === "staff" || role === "admin") return next();
  return res.status(403).json({ error: "Forbidden" });
}

export const bugsRouter = Router();

// DEFINING SCHEMAS USING ZOD
// Request body should contain title and description. The rest of the options are optional.
const createBugSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  stepsToReproduce: z.string().optional(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]).optional()
});

// GET
const listQuerySchema = z.object({
  status: z.enum(["new", "triaged", "in_progress", "fixed", "verified", "closed"]).optional(),
  severity: z.enum(["low", "medium", "high", "critical"]).optional()
});

// UPDATE
const updateStatusSchema = z.object({
  status: z.enum(["new", "triaged", "in_progress", "fixed", "verified", "closed"])
});

// Define endpoint with authorization middleware happening beforehand
bugsRouter.post("/", requireAuth, async (req: AuthedRequest, res) => {
  // Compare JSON with schema. If parsing unsucessful, return 400 error 
  const parsed = createBugSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Extract user {id, role} + the actual data from a bug report {title, description}
  const user = req.user!;
  const data = parsed.data;

  // Insert into database
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

  // Returns success response (201 = Created) and the bug report back to the client
  return res.status(201).json(bug);
});

// Define GET route with authorization middleware
bugsRouter.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const user = req.user!;

  // Confirms the response query provided is in the correct format
  const parsedQuery = listQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({ error: "Invalid query" });
  }

  const { status, severity } = parsedQuery.data;

  const where: any = {};

  if (status) where.status = status;
  if (severity) where.severity = severity;

  if (user.role === "playtester") {
    where.reporterId = user.id;
  }

  const bugs = await prisma.bugReport.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });

  return res.json(bugs);
});

// Define PATCH route with authorization middleware
bugsRouter.patch("/:id/status", requireAuth, requireStaff, async (req: AuthedRequest, res) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Express can occassionally return an array but prisma is expecting a string for id so we take the first value if an array is returned
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (typeof id !== "string" || id.trim().length === 0) {
    return res.status(400).json({ error: "Invalid id" });
  }

  // Update the bug report status within the database
  const updated = await prisma.bugReport.update({
    where: { id },
    data: { status: parsed.data.status }
  });

  return res.json(updated);
});