-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "participations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
