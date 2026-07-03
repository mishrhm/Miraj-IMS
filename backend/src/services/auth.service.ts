import bcrypt from "bcrypt"
import type { LoginBody, SignUpBody } from "../validators/auth.validator.js";
import { createNewUser, findUserByEmail } from "./user.service.js";
import jwt from "jsonwebtoken"


export class AuthService {

    static async registerUser(input: SignUpBody) {
        const { name, email, password, role } = input;

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            const error: any = new Error("This email address is already in use.")
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createNewUser({
            name,
            email,
            role,
            hashedPassword,
        })
        return newUser;
    }


    static async loginUser(input: LoginBody) {
        const { email, password } = input;

        const user = await findUserByEmail(email);
        if (!user) {
            const error: any = new Error("The email or password entered is invalid.")
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error: any = new Error("The password or email entered is invalid.")
            error.statusCode = 401;
            throw error;
        }

        const jwtSecret = process.env.JWT_SECRET || "HPAB40THPAB40T";

        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
        },
            jwtSecret,
            { expiresIn: "6d" },
        )

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        }
    }
}