import { z } from "zod";

export const CreateOrderSchema = z.object({
  body: z.object({
    customerName: z.string({ error: "Customer name is required." }).min(2),
    customerEmail: z.string().email().optional(),
    items: z
      .array(
        z.object({
          productId: z.uuid("Product ID must be a structurally valid UUID."),
          quantity: z.number().int().positive("Quantity must be at least 1."),
        }),
      )
      .min(1, "An order must contain at least one product item."),
  }),
});

export const OrderIdSchema = z.object({
  params: z.object({
    id: z.uuid("The order param ID must be a valid UUID reference."),
  }),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type CreateOrderDTO = CreateOrderInput["body"];
export type OrderIdDTO = z.infer<typeof OrderIdSchema>["params"];
