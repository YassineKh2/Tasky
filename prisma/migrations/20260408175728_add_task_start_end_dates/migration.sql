-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "countRestDaysAsMissing" BOOLEAN NOT NULL DEFAULT false,
    "countVacationDaysAsMissing" BOOLEAN NOT NULL DEFAULT false,
    "countOtherDaysAsMissing" BOOLEAN NOT NULL DEFAULT false,
    "resetStreakAtRestDay" BOOLEAN NOT NULL DEFAULT false,
    "resetStreakAtVacationDay" BOOLEAN NOT NULL DEFAULT false,
    "resetStreakAtOtherDay" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DayOff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateStr" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'REST',
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DayOff" ("createdAt", "dateStr", "id", "updatedAt") SELECT "createdAt", "dateStr", "id", "updatedAt" FROM "DayOff";
DROP TABLE "DayOff";
ALTER TABLE "new_DayOff" RENAME TO "DayOff";
CREATE UNIQUE INDEX "DayOff_dateStr_key" ON "DayOff"("dateStr");
CREATE TABLE "new_TaskDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "baselineDuration" INTEGER NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringDays" TEXT NOT NULL,
    "startDate" TEXT NOT NULL DEFAULT '2026-01-14',
    "endDate" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TaskDefinition" ("baselineDuration", "createdAt", "description", "id", "isRecurring", "recurringDays", "text", "updatedAt") SELECT "baselineDuration", "createdAt", "description", "id", "isRecurring", "recurringDays", "text", "updatedAt" FROM "TaskDefinition";
DROP TABLE "TaskDefinition";
ALTER TABLE "new_TaskDefinition" RENAME TO "TaskDefinition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
