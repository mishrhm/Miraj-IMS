import type { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error("❌ Unhandled Application Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    err.message || "An unexpected internal server error occurred.";

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
}
