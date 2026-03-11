import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { authRouter } from "./auth";
import { bugsRouter } from "./bugs";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/playtest/bugs", bugsRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(port, () => {
  console.log(`api listening on http://localhost:${port}`);
});
