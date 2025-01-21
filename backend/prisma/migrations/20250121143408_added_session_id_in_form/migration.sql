/*
  Warnings:

  - Made the column `sessionId` on table `FormFieldInteraction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FormFieldInteraction" ALTER COLUMN "sessionId" SET NOT NULL;
