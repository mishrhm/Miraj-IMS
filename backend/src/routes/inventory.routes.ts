import {
  Router,
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { InventoryService } from "../services/inventory.service.js";
import {
  ProductIdSchema,
  type ProductIdDTO,
} from "../validators/product.validator.js";
import { requireAuth, requireRoles } from "../middlewares/auth.middleware.js";
import { ROLE } from "@prisma/client";
import { validate } from "../middlewares/validate.middleware.js";

const inventoryRouter = Router();

const handleGetProductStockLevel: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params as ProductIdDTO;
    const stockLevel = await InventoryService.getProductStockLevel(productId);
    res.status(200).json({
      success: true,
      data: stockLevel,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetLowStockAlerts: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lowStockItems = await InventoryService.getLowStockAlerts();
    res.status(200).json({
      success: true,
      data: lowStockItems,
    });
  } catch (error) {
    next(error);
  }
};

inventoryRouter.use(
  requireAuth,
  requireRoles(ROLE.ADMIN, ROLE.MANAGER, ROLE.SALES),
);

inventoryRouter.get("/alerts", handleGetLowStockAlerts);

inventoryRouter.get(
  "/product/:productId",
  validate(ProductIdSchema),
  handleGetProductStockLevel,
);

export default inventoryRouter;
