-- CreateTable
CREATE TABLE "TripJournalEntry" (
    "id" TEXT NOT NULL,
    "tripPlanId" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "imageUrl" TEXT,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripJournalEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TripJournalEntry" ADD CONSTRAINT "TripJournalEntry_tripPlanId_fkey" FOREIGN KEY ("tripPlanId") REFERENCES "TripPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
