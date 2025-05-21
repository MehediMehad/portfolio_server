/*
  Warnings:

  - A unique constraint covering the columns `[userId,eventId]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reviews_eventId_key";

-- DropIndex
DROP INDEX "Reviews_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_userId_eventId_key" ON "Reviews"("userId", "eventId");
