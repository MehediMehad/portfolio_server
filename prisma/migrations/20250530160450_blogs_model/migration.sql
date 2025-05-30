/*
  Warnings:

  - You are about to drop the column `coverPhoto` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `date_time` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `heroSection` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `is_paid` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `registration_fee` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `venue` on the `blogs` table. All the data in the column will be lost.
  - Added the required column `content` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overview` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "blogs_authorId_key";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "coverPhoto",
DROP COLUMN "date_time",
DROP COLUMN "description",
DROP COLUMN "heroSection",
DROP COLUMN "is_paid",
DROP COLUMN "location",
DROP COLUMN "registration_fee",
DROP COLUMN "status",
DROP COLUMN "venue",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "overview" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- DropEnum
DROP TYPE "BlogStatus";
