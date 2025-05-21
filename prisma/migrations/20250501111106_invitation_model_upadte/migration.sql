/*
  Warnings:

  - You are about to drop the column `organizerId` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `responded_at` on the `invitations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invited_user_id,event_id]` on the table `invitations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,eventId]` on the table `participations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `respondedAt` to the `invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `invitations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE');

-- AlterTable
ALTER TABLE "invitations" DROP COLUMN "organizerId",
DROP COLUMN "responded_at",
ADD COLUMN     "respondedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL,
ALTER COLUMN "invited_user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Reviews" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "rating" "Rating" NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_userId_key" ON "Reviews"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_eventId_key" ON "Reviews"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "invitations_invited_user_id_event_id_key" ON "invitations"("invited_user_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "participations_userId_eventId_key" ON "participations"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
