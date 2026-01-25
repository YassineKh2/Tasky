-- CreateTable
CREATE TABLE "TaskDefinition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "baselineDuration" INTEGER NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurringDays" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TaskAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "dateStr" TEXT NOT NULL,
    "durationOverride" INTEGER,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "loggedHours" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "TaskDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DayOff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateStr" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TaskTracking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "hoursLogged" REAL NOT NULL,
    "dayCompleted" BOOLEAN NOT NULL DEFAULT false,
    "totalHours" REAL NOT NULL,
    "recurringDays" TEXT,
    "completionDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TaskTracking_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "TaskAssignment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TaskTracking_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "TaskDefinition" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TaskAssignment_taskId_idx" ON "TaskAssignment"("taskId");

-- CreateIndex
CREATE INDEX "TaskAssignment_dateStr_idx" ON "TaskAssignment"("dateStr");

-- CreateIndex
CREATE UNIQUE INDEX "DayOff_dateStr_key" ON "DayOff"("dateStr");

-- CreateIndex
CREATE INDEX "TaskTracking_assignmentId_idx" ON "TaskTracking"("assignmentId");

-- CreateIndex
CREATE INDEX "TaskTracking_taskId_idx" ON "TaskTracking"("taskId");
