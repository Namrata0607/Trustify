import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Trustify@2025", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@trustify.com" },
    update: {}, // don’t change existing admin
    create: {
      name: "Trustify Admin",
      email: "admin@trustify.com",
      password: hashedPassword,
      address: "Kolhapur",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created:", admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
