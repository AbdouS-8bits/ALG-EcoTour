import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding admin user...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@ecotour.com" },
    update: {},
    create: {
      email: "admin@ecotour.com",
      name: "Admin User",
      password: "Admin@123", // Change this to a hashed password in production
      role: "admin",
    },
  });

  console.log("✅ Admin user created/updated:", admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
