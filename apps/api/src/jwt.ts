import jwt, { JwtPayload } from "jsonwebtoken";

// This JWT utility module signs and verifies tokens

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

// takes id+role, creates token string signed by my JWT_SECRET, expiration time is 7 days
export function signToken(user: JwtUser) {
  return jwt.sign(user, getJwtSecret(), { expiresIn: "7d" });
}

// verify if a token was signed by my JWT_SECRET
export function verifyToken(token: string): JwtUser {
  // verification 
  const decoded = jwt.verify(token, getJwtSecret());

  // should return as JwTPayload, if not then throw error
  if (typeof decoded === "string") {
    throw new Error("Invalid token payload");
  }

  const payload = decoded as JwtPayload;

  const id = payload.id;
  const role = payload.role;

  // extra precautions to ensure there is an id + role
  if (typeof id !== "string") {
    throw new Error("Invalid token payload: missing id");
  }

  if (role !== "playtester" && role !== "staff" && role !== "admin") {
    throw new Error("Invalid token payload: missing role");
  }

  return { id, role };
}