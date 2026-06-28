import { log } from "node:console";
import { prisma } from "../prisma.js";
import type { ROLE } from "@prisma/client";

interface UserDTO {
  name: string;
  email: string;
  hashedPassword: string;
  role: ROLE;
}

export async function createNewUser(dto: UserDTO) {
  try {
    const { hashedPassword: password, ...rest } = dto;
    const createdUser = await prisma.user.create({
      data: {
        ...rest,
        password,
      },
      select: {
        email: true,
      },
    });
    log("👤 User created successfully:", createdUser);
    return createdUser;
  } catch (error) {
    console.error("❌ Failed to create user:", error);
    throw error;
  }
}

export async function listUsers() {
  try {
    const usersList = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    log(`📋 Retrieved ${usersList.length} users:`, usersList);
    return usersList;
  } catch (error) {
    console.error("❌ Failed to retrieve users list:", error);
    throw error;
  }
}

export async function deleteUserByUid(uid: string) {
  log("⏳ Attempting to delete user with UID:", uid);
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: uid,
      },
      select: {
        id: true,
        email: true,
      },
    });
    log("🗑️ User deleted successfully:", deletedUser);
    return deletedUser;
  } catch (error) {
    console.error(`❌ Failed to delete user with UID ${uid}:`, error);
    throw error;
  }
}

export async function deleteUserByEmail(email: string) {
  console.info("Deleting user with email:", email);

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
      },
    });
    log("🗑️ User deleted successfully:", deletedUser);
    return deletedUser;
  } catch (error) {
    console.error(`❌ Failed to delete user with email ${email}:`, error);
    throw error;
  }
}
