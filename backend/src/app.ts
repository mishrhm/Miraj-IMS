import cors from "cors";
import express, { type Request, type Response } from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import stockRouter from "./routes/stock-movement.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import supplierRouter from "./routes/supplier.routes.js";

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

app.use("/api/v1/categories", categoryRouter);

app.use("/api/v1/products", productRouter);

app.use("/api/v1/stock-movements", stockRouter);

app.use("/api/v1/inventory", inventoryRouter);

app.use("/api/v1/suppliers", supplierRouter);

app.use(errorMiddleware);

export default app;
