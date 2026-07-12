import {
  Router,
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import {
  LogStockMovementSchema,
  type CreateStockMovementDTO,
} from "../validators/stock-movement.validator.js";
import { StockMovementService } from "../services/stock-movement.service.js";
import { requireAuth, requireRoles } from "../middlewares/auth.middleware.js";
import { ROLE } from "@prisma/client";
import { validate } from "../middlewares/validate.middleware.js";

const StockRouter = Router();

const handleCreateStockMovement: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newMovement = await StockMovementService.logStockMovement(
      req.body as CreateStockMovementDTO,
      req.user!.userId,
    );
    res.status(201).json({
      success: true,
      data: newMovement,
    });
  } catch (error) {
    next(error);
  }
};

const handleListAllMovements: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allMovements = await StockMovementService.listStockMovements();
    res.status(200).json({
      success: true,
      data: allMovements,
    });
  } catch (error) {
    next(error);
  }
};

StockRouter.get(
  "/",
  requireAuth,
  requireRoles(ROLE.ADMIN, ROLE.CUSTOMER, ROLE.MANAGER, ROLE.SALES),
  handleListAllMovements,
);

StockRouter.post(
  "/",
  requireAuth,
  requireRoles(ROLE.ADMIN, ROLE.CUSTOMER, ROLE.MANAGER, ROLE.SALES),
  validate(LogStockMovementSchema),
  handleCreateStockMovement,
);

export default StockRouter;
