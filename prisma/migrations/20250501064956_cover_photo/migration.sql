/*
  Warnings:

  - Added the required column `coverPhoto` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "coverPhoto" TEXT NOT NULL;
