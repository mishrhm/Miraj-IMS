import { z } from "zod"

export const CreateCategorySchema = z.object({
    body: z.object({
        name: z.string({ error: "Category name is required." })
            .min(3, "Category name should be atleast 3 characters long.").trim(),
        description: z.string().trim()
            .nullable()
    })
})

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type CreateCategoryBody = CreateCategoryInput["body"];