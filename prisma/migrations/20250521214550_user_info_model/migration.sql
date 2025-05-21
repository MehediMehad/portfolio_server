/*
  Warnings:

  - The values [MALE,FEMALE,OTHER] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isDeleted` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invitations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `participations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `aboutMe` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `profilePhoto` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('Male');
ALTER TABLE "users" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_event_id_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_senderId_fkey";

-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_eventId_fkey";

-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_userId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_eventsId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_participation_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isDeleted",
DROP COLUMN "status",
DROP COLUMN "stripeCustomerId",
ADD COLUMN     "aboutMe" TEXT NOT NULL,
ADD COLUMN     "blogCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "projectCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "skillCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "socialMediaLinks" TEXT[],
ALTER COLUMN "profilePhoto" SET NOT NULL,
ALTER COLUMN "gender" SET DEFAULT 'Male';

-- DropTable
DROP TABLE "Reviews";

-- DropTable
DROP TABLE "invitations";

-- DropTable
DROP TABLE "participations";

-- DropTable
DROP TABLE "payments";

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "projectImage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date_time" TEXT NOT NULL,
    "techStack" TEXT[],
    "features" TEXT[],
    "WhatILearned" TEXT[],
    "futureImprovements" TEXT[],
    "liveURL" TEXT NOT NULL,
    "gitHubURL" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "heroSection" BOOLEAN NOT NULL DEFAULT false,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "registration_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverPhoto" TEXT NOT NULL,
    "date_time" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "heroSection" BOOLEAN NOT NULL DEFAULT false,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "registration_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_id_key" ON "projects"("id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_authorId_key" ON "projects"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_authorId_key" ON "blogs"("authorId");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
