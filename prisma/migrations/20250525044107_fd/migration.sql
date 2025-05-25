/*
  Warnings:

  - You are about to drop the `user_skills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_skills" DROP CONSTRAINT "user_skills_skillsId_fkey";

-- DropForeignKey
ALTER TABLE "user_skills" DROP CONSTRAINT "user_skills_userId_fkey";

-- DropTable
DROP TABLE "user_skills";
