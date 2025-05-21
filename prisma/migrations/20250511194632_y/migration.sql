-- DropForeignKey
ALTER TABLE "participations" DROP CONSTRAINT "participations_paymentId_fkey";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_participation_id_fkey" FOREIGN KEY ("participation_id") REFERENCES "participations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
