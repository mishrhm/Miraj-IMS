import { prisma } from "../prisma.js";
import { log } from "node:console";
import { handleDbError } from "../utils/db-error.js";
import { OrderStatus, MovementType } from "@prisma/client";
import type { CreateOrderDTO } from "../validators/order.validator.js";

export class OrderService {
  static async createOrder(dto: CreateOrderDTO) {
    try {
      log(
        `🛒 Initializing checkout pipeline for customer: ${dto.customerName}`,
      );

      return await prisma.$transaction(async (tx) => {
        // Fetch products to verify pricing and build items snapshot
        const productIds = dto.items.map((i) => i.productId);
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        });

        if (products.length !== dto.items.length) {
          throw new Error(
            "One or more product variants in the cart do not exist.",
          );
        }

        // Generate sequential tracking invoice number
        const totalOrders = await tx.order.count();
        const orderNumber = `INV-${new Date().getFullYear()}-${String(totalOrders + 1).padStart(4, "0")}`;

        // Calculate Total Amount
        let totalAmount = 0;
        const itemsToCreate = dto.items.map((item) => {
          const matchedProduct = products.find((p) => p.id === item.productId)!;
          const price = Number(matchedProduct.sellingPrice || 100);
          totalAmount += price * item.quantity;

          return {
            productId: item.productId,
            quantity: item.quantity,
            priceAtSale: price,
          };
        });

        // Commit Parent Order & Child Items
        return await tx.order.create({
          data: {
            orderNumber,
            customerName: dto.customerName,
            customerEmail: dto.customerEmail,
            totalAmount,
            status: OrderStatus.PENDING,
            items: { create: itemsToCreate },
          },
          include: { items: true },
        });
      });
    } catch (error) {
      return handleDbError("Create Order", error);
    }
  }

  static async fulfillOrder(orderId: string, initiatedByUid: string) {
    try {
      log(
        `📦 Committing physical stock fulfillment allocation for Order UUID: ${orderId}`,
      );

      return await prisma.$transaction(async (tx) => {
        // Lock and view target order context parameters
        const order = await tx.order.findUniqueOrThrow({
          where: { id: orderId },
          include: { items: true },
        });

        if (order.status !== OrderStatus.PENDING) {
          return {
            isOperational: true,
            statusCode: 400,
            message: `Fulfillment aborted: Order status is already explicitly set to ${order.status}.`,
          };
        }

        // Map line items to immediate automated OUTGOING stock movements ledger entries
        const stockMovementPayloads = order.items.map((item) => ({
          type: MovementType.OUTGOING,
          quantity: item.quantity,
          productId: item.productId,
          pricePerUnit: item.priceAtSale,
          initiatedByUid,
        }));

        await tx.stockMovement.createMany({
          data: stockMovementPayloads,
        });

        // Mark the final Order as Fulfilled
        return await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.FULFILLED },
          include: { items: true },
        });
      });
    } catch (error) {
      return handleDbError("Fulfill Order", error);
    }
  }
}
