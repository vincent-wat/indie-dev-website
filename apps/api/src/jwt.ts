import jwt, { JwtPayload } from "jsonwebtoken";

export type JwtUser = {
  id: string;
  role: "playtester" | "staff" | "admin";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }
  return secret;
}

export function signToken(user: JwtUser) {
  return jwt.sign(user, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtUser {
  const decoded = jwt.verify(token, getJwtSecret());

  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  const payload = decoded as JwtPayload;

  const id = payload.id;
  const role = payload.role;

  if (typeof id !== "string") {
    throw new Error("Invalid token payload: missing id");
  }

  if (role !== "playtester" && role !== "staff" && role !== "admin") {
    throw new Error("Invalid token payload: missing role");
  }

  return { id, role };
}