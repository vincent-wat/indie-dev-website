import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./auth";
import { bugsRouter } from "./bugs";
import cookieParser from "cookie-parser";

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

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/playtest/bugs", bugsRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`api listening on port ${port}`);
});
