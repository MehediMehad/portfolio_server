/*
  Warnings:

  - You are about to drop the column `name` on the `social_media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[platformName]` on the table `social_media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `platformName` to the `social_media` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "social_media_name_key";

-- AlterTable
ALTER TABLE "social_media" DROP COLUMN "name",
ADD COLUMN     "platformName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "social_media_platformName_key" ON "social_media"("platformName");
