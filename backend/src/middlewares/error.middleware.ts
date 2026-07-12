import type { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
      },
    });
  }

  console.error("🚨 [CRITICAL UNHANDLED CRASH]:", err.stack || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: "An unexpected internal server error occurred.",
      status: statusCode,
    },
  });
}
