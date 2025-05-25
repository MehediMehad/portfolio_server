/*
  Warnings:

  - You are about to drop the `_UserSkills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserSkills" DROP CONSTRAINT "_UserSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserSkills" DROP CONSTRAINT "_UserSkills_B_fkey";

-- DropTable
DROP TABLE "_UserSkills";
