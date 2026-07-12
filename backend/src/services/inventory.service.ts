import { MovementType } from "@prisma/client";
import { prisma } from "../prisma.js";
import { handleDbError } from "../utils/db-error.js";

export class InventoryService {
  static async getProductStockLevel(productId: string) {
    try {
      const movements = await prisma.stockMovement.findMany({
        where: { productId },
        select: { type: true, quantity: true },
      });

      let currentStock = 0;
      for (const movement of movements) {
        if (movement.type === MovementType.INCOMING) {
          currentStock += movement.quantity;
        } else if (movement.type === MovementType.OUTGOING) {
          currentStock -= movement.quantity;
        } else if (movement.type === MovementType.ADJUSTMENT) {
          currentStock = movement.quantity;
        }
      }
      return {
        productId,
        currentStock: Math.max(0, currentStock),
      };
    } catch (error) {
      handleDbError("Calculate Product Stock Level", error);
    }
  }

  static async getLowStockAlerts() {
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          sku: true,
          reorderPoint: true,
          category: {
            select: {
              name: true,
            },
          },
          purchasePrice: true,
          movements: {
            select: {
              type: true,
              quantity: true,
            },
          },
        },
      });

      const lowStockItems = [];

      for (const product of products) {
        let currentStock = 0;

        for (const movement of product.movements) {
          if (movement.type === MovementType.INCOMING)
            currentStock += movement.quantity;
          else if (movement.type === MovementType.OUTGOING)
            currentStock -= movement.quantity;
          else if (movement.type === MovementType.ADJUSTMENT)
            currentStock = movement.quantity;
        }

        if (currentStock <= product.reorderPoint) {
          lowStockItems.push(product);
        }
      }

      return lowStockItems;
    } catch (error) {
      handleDbError("Calculate Low Stock Alerts", error);
    }
  }
}
