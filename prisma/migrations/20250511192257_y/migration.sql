/*
  Warnings:

  - You are about to drop the column `paymentGatewayData` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `payments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";

-- DropIndex
DROP INDEX "participations_eventId_key";

-- DropIndex
DROP INDEX "payments_eventId_key";

-- DropIndex
DROP INDEX "payments_userId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentGatewayData",
DROP COLUMN "userId";
