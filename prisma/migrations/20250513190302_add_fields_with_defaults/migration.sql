/*
  Warnings:

  - A unique constraint covering the columns `[participationId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventsId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participationId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_participation_id_fkey";

-- DropIndex
DROP INDEX "payments_participation_id_key";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "eventsId" TEXT NOT NULL,
ADD COLUMN     "participationId" TEXT NOT NULL,
ALTER COLUMN "participation_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_participationId_key" ON "payments"("participationId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_eventId_key" ON "payments"("eventId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "participations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_eventsId_fkey" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
