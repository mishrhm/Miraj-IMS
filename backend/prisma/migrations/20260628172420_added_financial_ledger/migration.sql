/*
  Warnings:

  - Added the required column `pricePerUnit` to the `stockMovements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "stockMovements" ADD COLUMN     "commissionPaid" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "deliveryFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN     "pricePerUnit" DECIMAL(10,2) NOT NULL;
