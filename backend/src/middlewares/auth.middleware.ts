import jwt from "jsonwebtoken";
import type { NextFunction, RequestHandler, Request, Response } from "express";
import type { ROLE } from "@prisma/client";

interface JwtPayload {
    userId: string,
    email: string,
    role: ROLE,
}

export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                error: {
                    message: "Authentication failed. Token missing or malformed."
                }
            })
            return;
        }
        const token = authHeader.split(" ")[1] ?? "";
        const jwtSecret = process.env.JWT_SECRET || "HPAB40THPAB40T";

        const { userId, email, role } = jwt.verify(token, jwtSecret) as JwtPayload;
        req.user = {
            userId,
            email,
            role,
        }
        next();
    } catch (error) {
        next(error);
    }
}