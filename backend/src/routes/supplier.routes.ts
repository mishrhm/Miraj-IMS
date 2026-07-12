import { Router, type RequestHandler } from "express";
import { requireAuth, requireRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { SupplierService } from "../services/supplier.service.js";
import { ROLE } from "@prisma/client";
import {
  CreateSupplierSchema,
  SupplierIdSchema,
  type CreateSupplierDTO,
  type SupplierIdDTO,
} from "../validators/supplier.validator.js";

const supplierRouter = Router();

const handleCreateSupplier: RequestHandler = async (req, res, next) => {
  try {
    const newSupplier = await SupplierService.createSupplier(
      req.body as CreateSupplierDTO,
    );
    res.status(201).json({
      success: true,
      data: newSupplier,
    });
  } catch (error) {
    next(error);
  }
};

const handleListSuppliers: RequestHandler = async (req, res, next) => {
  try {
    const vendors = await SupplierService.getAllSuppliers();
    res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetSupplierDetails: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as SupplierIdDTO;
    const vendorDetails = await SupplierService.getSupplierById(id);
    res.status(200).json({
      success: true,
      data: vendorDetails,
    });
  } catch (error) {
    next(error);
  }
};

supplierRouter.use(requireAuth, requireRoles(ROLE.ADMIN, ROLE.MANAGER));

supplierRouter.post("/", validate(CreateSupplierSchema), handleCreateSupplier);
supplierRouter.get("/", handleListSuppliers);
supplierRouter.get(
  "/:id",
  validate(SupplierIdSchema),
  handleGetSupplierDetails,
);

export default supplierRouter;
