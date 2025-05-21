/*
  Warnings:

  - You are about to drop the column `participationId` on the `payments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_participationId_fkey";

-- DropIndex
DROP INDEX "payments_participationId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "participationId";
