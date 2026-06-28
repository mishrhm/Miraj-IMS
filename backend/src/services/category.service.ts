import { log } from "node:console";
import { prisma } from "../prisma.js";
import { handleDbError } from "../utils/db-error.js";

interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export async function createCategory(dto: CreateCategoryDTO) {
  try {
    log(`Creating category for ${dto.name}`);
    const category = await prisma.category.create({
      data: dto,
    });
    return category;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error(`Category with name "${dto.name}" already exists.`);
    }
    handleDbError("Create Category", error);
    throw error;
  }
}

export async function listCategories() {
  try {
    const categoryList = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return categoryList;
  } catch (error) {
    handleDbError("List Category", error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    const categoryWithProducts = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (categoryWithProducts && categoryWithProducts._count.products > 0) {
      throw new Error(
        "Cannot delete category because it contains active products.",
      );
    }

    return await prisma.category.delete({
      where: { id },
    });
  } catch (error) {
    handleDbError("Delete Category", error);
    throw error;
  }
}
