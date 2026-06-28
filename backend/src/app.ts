import cors from "cors";
import express, {
  type RequestHandler,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { uptime } from "node:process";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
});

export default app;
