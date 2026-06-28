import type { MovementType } from "@prisma/client";
import { prisma } from "../prisma.js";
import { log } from "node:console";
import { handleDbError } from "../utils/db-error.js";

interface LogMovementDTO {
  type: MovementType;
  quantity: number;
  productId: string;
  initiatedByUid: string;
}

export async function logStockMovement(dto: LogMovementDTO) {
  try {
    log(
      `📦 Logging stock adjustment [${dto.type}] for Product ID: ${dto.productId}`,
    );
    const movement = await prisma.stockMovement.create({
      data: dto,
    });

    return movement;
  } catch (error) {
    handleDbError("Log Stock Movement", error);
    throw error;
  }
}

export async function listStockMovements() {
  try {
    const movementList = await prisma.stockMovement.findMany({
      orderBy: { timestamp: "asc" },
      include: {
        product: true,
        initiatedBy: { select: { name: true, email: true } },
      },
    });
    return movementList;
  } catch (error) {
    handleDbError("List Stock Movements", error);
    throw error;
  }
}
