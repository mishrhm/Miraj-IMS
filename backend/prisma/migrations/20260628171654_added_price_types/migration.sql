/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - Added the required column `purchasePrice` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retailPrice` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellingPrice` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "price",
ADD COLUMN     "purchasePrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "reorderPoint" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "retailPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "sellingPrice" DECIMAL(10,2) NOT NULL;
