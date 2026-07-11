import { prisma } from "../prisma.js";
import { handleDbError } from "../utils/db-error.js";
import type { CreateProductDTO } from "../validators/product.validator.js";

export class ProductService {
  static async createProduct(dto: CreateProductDTO, addedByUid: string) {
    try {
      const product = await prisma.product.create({
        data: {
          ...dto,
          reorderPoint: dto.reorderPoint ?? 10,
          addedByUid: addedByUid,
        },
      });
      return product;
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error(
          `Product mapping failed: SKU "${dto.sku}" is already assigned.`,
        );
      }
      handleDbError("Create Product", error);
      throw error;
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