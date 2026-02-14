-- CreateTable
CREATE TABLE "DayNotes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateStr" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DayNotes_dateStr_key" ON "DayNotes"("dateStr");
