import bcrypt from "bcrypt"
import type { SignUpInput } from "../validators/auth.validator.js";
import { prisma } from "../prisma.js";
import { createNewUser, findUserByEmail } from "./user.service.js";


export class AuthService {

    static async registerUser(input: SignUpInput["body"]) {
        const { name, email, password, role } = input;

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            const error: any = new Error("This email address is already in use.")
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createNewUser({
            name: name,
            email: email,
            role: role,
            hashedPassword: hashedPassword,
        })
        return newUser;
    }
}