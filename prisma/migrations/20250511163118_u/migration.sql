/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `participations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "participations_eventId_key" ON "participations"("eventId");
