import { log } from "node:console";
import { prisma } from "../prisma.js";
import { handleDbError } from "../utils/db-error.js";
import type { CreateCategoryBody } from "../validators/category.validator.js";

export class CategoryService {

  static async createCategory(dto: CreateCategoryBody) {
    try {
      log(`[CategoryService] Initiating creation payload for: ${dto.name}`);
      const category = await prisma.category.create({
        data: dto,
      });
      return category;
    } catch (error: any) {
      if (error.code === "P2002") {
        const customError: any = new Error(`Category with name "${dto.name}" already exists.`);
        customError.statusCode = 400;
        throw customError;
      }

      handleDbError("Create Category", error);
    }
  }

  static async getAllCategories() {
    try {
      return await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
    } catch (error) {
      handleDbError("List Category", error);
    }
  }

  static async deleteCategory(id: string) {
    try {
      const categoryWithProducts = await prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { products: true } } },
      });

      if (categoryWithProducts && categoryWithProducts._count.products > 0) {
        const customError: any = new Error(
          "Cannot delete category because it contains active products.",
        );
        customError.statusCode = 400;
        throw customError;
      }

      return await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      handleDbError("Delete Category", error);
    }
  }
}