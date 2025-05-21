/*
  Warnings:

  - You are about to drop the column `reserverId` on the `invitations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receiverId,event_id]` on the table `invitations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_reserverId_fkey";

-- DropIndex
DROP INDEX "invitations_reserverId_event_id_key";

-- AlterTable
ALTER TABLE "invitations" DROP COLUMN "reserverId",
ADD COLUMN     "receiverId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "invitations_receiverId_event_id_key" ON "invitations"("receiverId", "event_id");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
