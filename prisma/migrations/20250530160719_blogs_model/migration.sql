/*
  Warnings:

  - You are about to drop the column `skillsId` on the `blogs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_skillsId_fkey";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "skillsId";
