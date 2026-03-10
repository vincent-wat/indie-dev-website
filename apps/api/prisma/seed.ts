import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);

  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: { email: "admin@demo.com", passwordHash, displayName: "Admin Demo", role: "admin" }
  });

  await prisma.user.upsert({
    where: { email: "staff@demo.com" },
    update: {},
    create: { email: "staff@demo.com", passwordHash, displayName: "Staff Demo", role: "staff" }
  });

  await prisma.user.upsert({
    where: { email: "tester@demo.com" },
    update: {},
    create: { email: "tester@demo.com", passwordHash, displayName: "Tester Demo", role: "playtester" }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });