#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    const admin = await prisma.user.upsert({
      where: { email: "admin@ecotour.com" },
      update: {},
      create: {
        email: "admin@ecotour.com",
        name: "Admin User",
        password: "Admin@123",
        role: "admin",
      },
    });

    console.log("✅ Admin user seeded:", admin);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
