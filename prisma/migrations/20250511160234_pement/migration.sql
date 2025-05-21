/*
  Warnings:

  - You are about to drop the column `participation_id` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_paymentId_fkey";

-- DropIndex
DROP INDEX "payments_participation_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "participation_id",
ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_eventId_key" ON "payments"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_userId_key" ON "payments"("userId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
