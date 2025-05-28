-- AlterTable
ALTER TABLE "projects" ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "projects_id_key";
