-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiredAt" SET DEFAULT (now() + interval '30 days');
