import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./auth";
import { bugsRouter } from "./bugs";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
dotenv.config();

const app = express();

const corsOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost:3000",
  "https://pippystudios.com",
  "https://www.pippystudios.com"
];

const allowedOrigins = corsOrigins.length ? corsOrigins : defaultOrigins;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10, // 10 signups per hour per IP
  standardHeaders: true,
  legacyHeaders: false
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10, // 10 reset emails per hour per IP
  standardHeaders: true,
  legacyHeaders: false
});

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Apply rate limits
app.use("/auth/login", authLimiter);
app.use("/auth/logout", authLimiter);
app.use("/auth/reset-password", authLimiter);

app.use("/auth/signup", signupLimiter);
app.use("/auth/forgot-password", passwordResetLimiter);

app.use("/auth", authRouter);
app.use("/playtest/bugs", bugsRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`api listening on port ${port}`);
});
