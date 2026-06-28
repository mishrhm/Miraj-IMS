import type { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "../prisma.js";

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
    console.error("❌ Database error creating product:", error);
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
    console.error("❌ Database error listing product:", error);
    throw error;
  }
}
