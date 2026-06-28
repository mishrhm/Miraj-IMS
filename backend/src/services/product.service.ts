import type { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "../prisma.js";
import { handleDbError } from "../utils/db-error.js";

interface CreateProductDTO {
  name: string;
  sku: string;
  description: string;
  price: number | Decimal;
  addedByUid: string;
  categoryId: string;
}

export async function createProduct(dto: CreateProductDTO) {
  try {
    const product = await prisma.product.create({
      data: dto,
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

export async function listProducts() {
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
    throw error;
  }
}
