import { prisma } from "../prisma.js";
import { log } from "node:console";
import { handleDbError } from "../utils/db-error.js";
import type { CreateSupplierDTO } from "../validators/supplier.validator.js";

export class SupplierService {
  static async createSupplier(dto: CreateSupplierDTO) {
    try {
      log(`🏢 Registering new vendor partner: ${dto.name}`);
      return await prisma.supplier.create({
        data: dto,
      });
    } catch (error) {
      handleDbError("Create Supplier", error);
    }
  }

  static async getAllSuppliers() {
    try {
      return await prisma.supplier.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: { select: { products: true } },
        },
      });
    } catch (error) {
      handleDbError("List Suppliers", error);
    }
  }

  static async getSupplierById(id: string) {
    try {
      return await prisma.supplier.findUniqueOrThrow({
        where: { id },
        include: { products: true },
      });
    } catch (error) {
      handleDbError("Get Supplier Details", error);
    }
  }
}
