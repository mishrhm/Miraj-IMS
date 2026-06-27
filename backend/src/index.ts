import { log } from "node:console";
import { prisma } from "./prisma.js";

async function createNewUser() {
  try {
    log("Sending user data to PostgreSQL in Docker...");

    const newUser = await prisma.user.create({
      data: {
        name: "Mish Rahman",
        email: "mishal@miraj.co",
        password: "mish123321",
        role: "Tech Lead",
      },
    });

    log("🎉 Added new user successfully:", newUser);
  } catch (error) {
    console.error("❌ Database insertion failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createNewUser();
