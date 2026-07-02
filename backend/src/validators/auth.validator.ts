import { ROLE } from "@prisma/client";
import { z } from "zod";


export const SignUpSchema = z.object({
    body: z.object({
        name: z.string({ error: "Name is a required field to sign up." })
            .min(5, "Name must be at least 5 characters long.")
            .trim(),

        email: z.email({ error: "Please provide a valid email address." }),

        password: z.string({ error: "Password is required to create an account" })
            .min(4, "Password should be at least 4 characters long."),

        role: z.enum(Object.values(ROLE)).optional().default(ROLE.CUSTOMER)
    })
})

export type SignUpInput = z.infer<typeof SignUpSchema>