/*
  Warnings:

  - You are about to drop the column `eventId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[participation_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participation_id` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_eventId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";

-- DropIndex
DROP INDEX "payments_eventId_key";

-- DropIndex
DROP INDEX "payments_userId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "eventId",
DROP COLUMN "userId",
ADD COLUMN     "participation_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_participation_id_key" ON "payments"("participation_id");

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
