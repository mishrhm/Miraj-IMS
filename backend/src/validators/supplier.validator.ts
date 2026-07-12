import { z } from "zod";

export const CreateSupplierSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Supplier name is required." })
      .min(2, "Supplier name must be at least 2 characters long."),

    contactPerson: z.string().optional(),

    email: z
      .string({ error: "Email address is required." })
      .email("Please provide a valid email address structure."),

    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const SupplierIdSchema = z.object({
  params: z.object({
    id: z.uuid(
      "The supplier param ID must be a structurally valid UUID reference.",
    ),
  }),
});

export type CreateSupplierInput = z.infer<typeof CreateSupplierSchema>;
export type CreateSupplierDTO = CreateSupplierInput["body"];
export type SupplierIdDTO = z.infer<typeof SupplierIdSchema>["params"];
