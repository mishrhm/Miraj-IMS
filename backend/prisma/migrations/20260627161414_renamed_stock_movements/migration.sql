/*
  Warnings:

  - You are about to drop the `StockMovement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_initiatedByUid_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_productId_fkey";

-- DropTable
DROP TABLE "StockMovement";

-- CreateTable
CREATE TABLE "stockMovements" (
    "id" UUID NOT NULL,
    "type" "MovementType" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" UUID NOT NULL,
    "initiatedByUid" UUID NOT NULL,

    CONSTRAINT "stockMovements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stockMovements" ADD CONSTRAINT "stockMovements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stockMovements" ADD CONSTRAINT "stockMovements_initiatedByUid_fkey" FOREIGN KEY ("initiatedByUid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
