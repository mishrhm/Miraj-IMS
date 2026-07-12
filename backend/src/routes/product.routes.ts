import {
  Router,
  type NextFunction,
  type RequestHandler,
  type Request,
  type Response,
} from "express";
import { ProductService } from "../services/product.service.js";
import {
  CreateProductSchema,
  type CreateProductDTO,
} from "../validators/product.validator.js";
import { requireAuth, requireRoles } from "../middlewares/auth.middleware.js";
import { ROLE } from "@prisma/client";
import { validate } from "../middlewares/validate.middleware.js";

const productRouter = Router();

const handleCreateProduct: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const addedByUid = req.user!.userId;
    const newProduct = await ProductService.createProduct(
      req.body as CreateProductDTO,
      addedByUid,
    );
    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetAllProducts: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allProducts = await ProductService.getAllProducts();
    res.status(200).json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    next(error);
  }
};

productRouter.post(
  "/",
  requireAuth,
  requireRoles(ROLE.ADMIN, ROLE.MANAGER, ROLE.SALES),
  validate(CreateProductSchema),
  handleCreateProduct,
);

productRouter.get("/", handleGetAllProducts);

export default productRouter;
