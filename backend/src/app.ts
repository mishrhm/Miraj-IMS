import cors from "cors";
import express, {
  type Request,
  type Response
} from "express";
import { errorMiddleWare } from "./middlewares/error.middleware.js";


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


app.use(errorMiddleWare);

export default app;
