import { log } from "node:console";
import { Interface } from "node:readline";
import { prisma } from "../prisma.js";

interface UserDetails {
  name: string;
  email: string;
  password: string;
}

export async function createNewUser(userDetails: UserDetails) {
  try {
    const createdUser = await prisma.user.create({
      data: {
        email: userDetails.email,
        name: userDetails.name,
        password: userDetails.password, //We should encrypt this
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
