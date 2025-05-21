/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `participations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "participations_eventId_key" ON "participations"("eventId");
