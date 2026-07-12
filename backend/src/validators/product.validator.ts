import { z } from "zod";

export const CreateProductSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Product name is required." })
      .min(2, "Product name must be at least 2 characters long.")
      .max(150, "Product name cannot exceed 150 characters.")
      .trim(),

    sku: z
      .string({ error: "SKU stock code is required." })
      .min(3, "SKU code must be specified.")
      .max(50, "SKU code cannot exceed 50 characters.")
      .trim(),

    description: z
      .string({ error: "Description string is required." })
      .max(1000, "Description cannot exceed 1000 characters.")
      .trim(),

    purchasePrice: z
      .number({ error: "Purchase price must be a valid numeric value." })
      .positive("Purchase price must be greater than 0."),

    retailPrice: z
      .number({ error: "Retail price must be a valid numeric value." })
      .positive("Retail price must be greater than 0."),

    sellingPrice: z
      .number({ error: "Selling price must be a valid numeric value." })
      .positive("Selling price must be greater than 0."),

    reorderPoint: z
      .number({ error: "Reorder point threshold must be an integer number." })
      .int("Reorder point must be a whole integer.")
      .nonnegative("Reorder point cannot drop below 0.")
      .optional(),

    categoryId: z
      .string({ error: "A valid Category association ID is required." })
      .uuid("Category ID must be a structurally valid UUID reference string."),
  }),
});

export const ProductIdSchema = z.object({
  params: z.object({
    productId: z.uuid(
      "The product id param should be a valid UUID reference of the product.",
    ),
  }),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type CreateProductDTO = CreateProductInput["body"];
export type ProductIdInput = z.infer<typeof ProductIdSchema>;
export type ProductIdDTO = ProductIdInput["params"];
