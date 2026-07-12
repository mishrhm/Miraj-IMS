import { MovementType } from "@prisma/client";
import { z } from "zod";

const StockMovementSchema = z.object({
  body: z.object({
    type: z.enum(MovementType, {
      error:
        "Invalid movement type. Must match a registered stock movement transaction type.",
    }),

    quantity: z
      .number({ error: "Quantity must be a valid integer number." })
      .int("Quantity must be a whole unit.")
      .positive("Transaction quantity must be a number greater than 0."),
  }),

  productId: z.uuid(
    "Product ID reference string is required and must be a valid UUID reference string.",
  ),

  pricePerUnit: z
    .number({ error: "Price per unit must be a valid numeric value." })
    .positive("Price per unit must be a number greater than 0."),

  deliveryFee: z
    .number({ error: "Delivery Fee must be a valid numeric value." })
    .nonnegative("Delivery fee cannot drop below 0.")
    .optional(),

  commissionPaid: z
    .number({ error: "Commission paid must be a valid numeric value." })
    .nonnegative("Commission paid cannot drop below 0.")
    .optional(),
});

export type CreateStockMovementInput = z.infer<typeof StockMovementSchema>;
export type CreateStockMovementDTO = CreateStockMovementInput["body"];
