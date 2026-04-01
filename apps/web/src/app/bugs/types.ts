export type Role = "playtester" | "staff" | "admin";

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: Role;
  };
};

export type Bug = {
  id: string;
  title: string;
  description: string;
  stepsToReproduce: string | null;
  expectedResult: string | null;
  actualResult: string | null;
  severity: "low" | "medium" | "high" | "critical";
  status: "new" | "closed";
  reporterId: string;
  createdAt: string;
  updatedAt: string;
};