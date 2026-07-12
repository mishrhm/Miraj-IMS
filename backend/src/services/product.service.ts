import { prisma } from "../prisma.js";
import { handleDbError } from "../utils/db-error.js";
import type { CreateProductDTO } from "../validators/product.validator.js";

export class ProductService {
  static async createProduct(dto: CreateProductDTO, addedByUid: string) {
    try {
      const product = await prisma.product.create({
        data: {
          ...dto,
          reorderPoint: dto.reorderPoint,
          addedByUid: addedByUid,
        },
      });
      return product;
    } catch (error: any) {
      handleDbError("Create Product", error);
    }
  }

  static async getAllProducts() {
    try {
      const productList = await prisma.product.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          category: {
            select: { name: true },
          },
          addedBy: {
            select: { name: true, email: true },
          },
          _count: true,
        },
      });
      return productList;
    } catch (error) {
      handleDbError("List Products", error);
    }
  }
}
