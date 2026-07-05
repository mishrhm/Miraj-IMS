import { type RequestHandler, type Request, type Response, type NextFunction, Router } from "express";
import { CategoryService } from "../services/category.service.js";
import { requireAuth, requireRoles } from "../middlewares/auth.middleware.js";
import { CreateCategorySchema, DeleteCategorySchema, type CreateCategoryBody, type DeleteCategoryParams } from "../validators/category.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { ROLE } from "@prisma/client";

const categoryRouter = Router();


const handleCreateCategory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newCategory = await CategoryService.createCategory(req.body as CreateCategoryBody);
        res.status(201).json({
            success: true,
            data: newCategory,
        })
    } catch (error) {
        next(error)
    }
};

const handleGetAllCategory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await CategoryService.getAllCategories();
        res.status(200).json({
            success: true,
            data: categories,
        })
    } catch (error) {
        next(error);
    }
};

const handleDeleteCategory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as DeleteCategoryParams;
        const deletedCategory = await CategoryService.deleteCategory(id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully."
        })
    } catch (error) {
        next(error)
    }
}

categoryRouter.get("/", handleGetAllCategory);
categoryRouter.post("/", requireAuth, validate(CreateCategorySchema), handleCreateCategory);
categoryRouter.post("/:id", requireAuth, requireRoles(ROLE.ADMIN, ROLE.MANAGER, ROLE.SALES), validate(DeleteCategorySchema), handleDeleteCategory);

export default categoryRouter;