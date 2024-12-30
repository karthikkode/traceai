/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `public.users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trace" DROP CONSTRAINT "Trace_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "public.users" DROP CONSTRAINT "public.users_organizationId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "elementContent" TEXT,
ADD COLUMN     "traceEvent" TEXT;

-- AlterTable
ALTER TABLE "Trace" DROP COLUMN "organizationId";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "public.users";
