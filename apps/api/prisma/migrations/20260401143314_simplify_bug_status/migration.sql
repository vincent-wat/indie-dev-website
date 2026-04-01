/*
  Warnings:

  - The values [triaged,in_progress,fixed,verified] on the enum `BugStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."BugStatus_new" AS ENUM ('new', 'closed');
ALTER TABLE "public"."BugReport" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."BugReport" ALTER COLUMN "status" TYPE "public"."BugStatus_new" USING ("status"::text::"public"."BugStatus_new");
ALTER TYPE "public"."BugStatus" RENAME TO "BugStatus_old";
ALTER TYPE "public"."BugStatus_new" RENAME TO "BugStatus";
DROP TYPE "public"."BugStatus_old";
ALTER TABLE "public"."BugReport" ALTER COLUMN "status" SET DEFAULT 'new';
COMMIT;
