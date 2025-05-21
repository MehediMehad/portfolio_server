-- AlterTable
ALTER TABLE "events" ALTER COLUMN "registration_fee" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
