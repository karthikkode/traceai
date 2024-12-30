/*
  Warnings:

  - You are about to drop the column `eventType` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `visitorId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `Visitor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ipAddress` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_visitorId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "eventType",
DROP COLUMN "timestamp",
DROP COLUMN "visitorId",
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "traceEventName" TEXT;

-- DropTable
DROP TABLE "Visitor";
