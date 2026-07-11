import { Prisma } from "@prisma/client";

export function handleDbError(action: string, error: any): never {

  const enhancedError = error;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        console.error(
          `❌ [${action}] Unique constraint failed: A record already exists with this ${(error.meta?.target as string[])?.join(", ") || "field"}.`
        );
        enhancedError.statusCode = 400; // Bad Request
        enhancedError.message = `Database operation failed: A record with this unique attribute value already exists.`;
        break;

      case "P2003":
        console.error(
          `❌ [${action}] Foreign key constraint failed: Cannot complete operation because this record is linked to other database entities.`
        );
        enhancedError.statusCode = 422; // Unprocessable Entity
        enhancedError.message = `Database operation failed: The referenced relation entity (e.g., categoryId or addedByUid) does not exist.`;
        break;

      case "P2025":
        console.error(
          `❌ [${action}] Record not found: Target record does not exist in the database.`
        );
        enhancedError.statusCode = 404; // Not Found
        enhancedError.message = `Database operation failed: The requested target record could not be found.`;
        break;

      default:
        console.error(
          `❌ [${action}] Prisma Database Error (${error.code}): ${error.message}`
        );
        enhancedError.statusCode = 500; //Internal Server Error fallback
    }
  } else {
    console.error(
      `❌ [${action}] Unexpected System Error:`,
      error?.message || error
    );
    if (!enhancedError.statusCode) {
      enhancedError.statusCode = 500;
    }
  }

  throw enhancedError; // Bubbles up carrying both terminal logs and explicit status keys!
}