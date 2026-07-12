import { prisma } from "../prisma.js";
import { log } from "node:console";
import { handleDbError } from "../utils/db-error.js";
import type { CreateStockMovementDTO } from "../validators/stock-movement.validator.js";

export class StockMovementService {
  static async logStockMovement(
    dto: CreateStockMovementDTO,
    initiatedByUid: string,
  ) {
    try {
      log(
        `📦 Logging stock adjustment [${dto.type}] for Product ID: ${dto.productId}`,
      );
      const movement = await prisma.stockMovement.create({
        data: {
          ...dto,
          initiatedByUid: initiatedByUid,
        },
      });
      return movement;
    } catch (error) {
      handleDbError("Log Stock Movement", error);
    }
  }

  static async listStockMovements() {
    try {
      const movementList = await prisma.stockMovement.findMany({
        orderBy: { timestamp: "desc" },
        include: {
          product: true,
          initiatedBy: { select: { name: true, email: true } },
        },
      });
      return movementList;
    } catch (error) {
      handleDbError("List Stock Movements", error);
    }
  }
}
