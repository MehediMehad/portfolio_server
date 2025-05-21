-- AlterTable
ALTER TABLE "events" ADD COLUMN     "heroSection" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "invitations" ADD COLUMN     "referredId" TEXT;
