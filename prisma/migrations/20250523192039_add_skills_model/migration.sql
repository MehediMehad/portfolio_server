/*
  Warnings:

  - The `status` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `WhatILearned` on the `projects` table. All the data in the column will be lost.
  - The `status` column on the `projects` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('PUBIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PUBIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "skillsId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "BlogStatus" NOT NULL DEFAULT 'PUBIC';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "WhatILearned",
ADD COLUMN     "skillsId" TEXT,
ADD COLUMN     "whatILearned" TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'PUBIC';

-- DropTable
DROP TABLE "events";

-- DropEnum
DROP TYPE "EventStatus";

-- DropEnum
DROP TYPE "InvitationStatus";

-- DropEnum
DROP TYPE "ParticipationPaymentStatus";

-- DropEnum
DROP TYPE "ParticipationStatus";

-- DropEnum
DROP TYPE "PaymentStatus";

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "heroSection" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "skillCount" INTEGER NOT NULL DEFAULT 0,
    "projectCount" INTEGER NOT NULL DEFAULT 0,
    "blogCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_skillsId_fkey" FOREIGN KEY ("skillsId") REFERENCES "skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_skillsId_fkey" FOREIGN KEY ("skillsId") REFERENCES "skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;
