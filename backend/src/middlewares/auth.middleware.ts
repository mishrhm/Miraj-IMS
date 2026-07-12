import jwt from "jsonwebtoken";
import type { NextFunction, RequestHandler, Request, Response } from "express";
import type { ROLE } from "@prisma/client";

interface JwtPayload {
  userId: string;
  email: string;
  role: ROLE;
}

export const requireAuth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: {
          message: "Authentication failed. Token missing or malformed.",
        },
      });
      return;
    }
    const token = authHeader.split(" ")[1] ?? "";
    const jwtSecret = process.env.JWT_SECRET || "HPAB40THPAB40T";

    const { userId, email, role } = jwt.verify(token, jwtSecret) as JwtPayload;
    req.user = {
      userId,
      email,
      role,
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRoles =
  (...allowedRoles: ROLE[]): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: {
            message: "Authentication required before checking permission.",
          },
        });
        return;
      }
      if (!allowedRoles.includes(req.user.role)) {
        res.status(401).json({
          error: {
            message:
              "Access denied. Your role has insufficient privilege to perform this action.",
          },
        });
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
