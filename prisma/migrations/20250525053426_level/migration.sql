/*
  Warnings:

  - You are about to drop the column `description` on the `skills` table. All the data in the column will be lost.
  - Added the required column `level` to the `skills` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "skills" DROP COLUMN "description",
ADD COLUMN     "level" TEXT NOT NULL;
