import cors from "cors";
import express, {
  type Request,
  type Response
} from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";


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

app.use("/api/v1/auth", authRouter);


app.use(errorMiddleware);

export default app;
