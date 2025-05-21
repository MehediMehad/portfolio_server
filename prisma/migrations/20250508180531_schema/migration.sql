/*
  Warnings:

  - You are about to drop the column `invited_user_id` on the `invitations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reserverId,event_id]` on the table `invitations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_invited_user_id_fkey";

-- DropIndex
DROP INDEX "invitations_invited_user_id_event_id_key";

-- AlterTable
ALTER TABLE "invitations" DROP COLUMN "invited_user_id",
ADD COLUMN     "reserverId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "invitations_reserverId_event_id_key" ON "invitations"("reserverId", "event_id");

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_reserverId_fkey" FOREIGN KEY ("reserverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
