import { log } from "node:console";
import { prisma } from "../prisma.js";
import type { ROLE } from "@prisma/client";
import { handleDbError } from "../utils/db-error.js";

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
    handleDbError("Create Users", error);
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return user;
  } catch (error) {
    handleDbError("Finding User:", error);
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
    handleDbError("List Users", error);
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
    handleDbError("Delete User By Id", error);
    throw error;
  }
}

export async function deleteUserByEmail(email: string) {
  console.info(`Deleting user with email: ${email}`);

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
    handleDbError("Delete User By Email", error);
    throw error;
  }
}
