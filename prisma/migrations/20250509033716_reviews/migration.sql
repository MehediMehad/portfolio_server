/*
  Warnings:

  - Changed the type of `rating` on the `Reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "rating",
ADD COLUMN     "rating" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Rating";
