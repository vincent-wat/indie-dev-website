-- CreateEnum
CREATE TYPE "public"."BugStatus" AS ENUM ('new', 'triaged', 'in_progress', 'fixed', 'verified', 'closed');

-- CreateEnum
CREATE TYPE "public"."Severity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateTable
CREATE TABLE "public"."BugReport" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stepsToReproduce" TEXT,
    "expectedResult" TEXT,
    "actualResult" TEXT,
    "severity" "public"."Severity" NOT NULL DEFAULT 'medium',
    "status" "public"."BugStatus" NOT NULL DEFAULT 'new',
    "reporterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BugReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BugReport_status_idx" ON "public"."BugReport"("status");

-- CreateIndex
CREATE INDEX "BugReport_severity_idx" ON "public"."BugReport"("severity");

-- CreateIndex
CREATE INDEX "BugReport_reporterId_idx" ON "public"."BugReport"("reporterId");

-- AddForeignKey
ALTER TABLE "public"."BugReport" ADD CONSTRAINT "BugReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
