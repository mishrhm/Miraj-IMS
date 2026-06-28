import { Prisma } from "@prisma/client";

export function handleDbError(action: string, error: any): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        console.error(
          `❌ [${action}] Unique constraint failed: A record already exists with this ${(error.meta?.target as string[])?.join(", ") || "field"}.`,
        );
        break;
      case "P2003":
        console.error(
          `❌ [${action}] Foreign key constraint failed: Cannot complete operation because this record is linked to other database entities.`,
        );
        break;
      case "P2025":
        console.error(
          `❌ [${action}] Record not found: Target record does not exist in the database.`,
        );
        break;
      default:
        console.error(
          `❌ [${action}] Prisma Database Error (${error.code}): ${error.message}`,
        );
    }
  } else {
    console.error(
      `❌ [${action}] Unexpected System Error:`,
      error?.message || error,
    );
  }
  throw error;
}
