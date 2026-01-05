#!/usr/bin/env node

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
});

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
