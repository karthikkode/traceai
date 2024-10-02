/*
  Warnings:

  - You are about to drop the column `metric` on the `Trace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Trace` DROP COLUMN `metric`,
    ADD COLUMN `trackerId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Tracker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `step` INTEGER NOT NULL,
    `traceId` INTEGER NOT NULL,

    UNIQUE INDEX `Tracker_step_traceId_key`(`step`, `traceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,
    `tagName` VARCHAR(191) NULL,
    `elementId` VARCHAR(191) NULL,
    `classList` VARCHAR(191) NULL,
    `innerText` VARCHAR(191) NULL,
    `href` VARCHAR(191) NULL,
    `outerHTML` VARCHAR(191) NULL,
    `timestamp` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tracker` ADD CONSTRAINT `Tracker_traceId_fkey` FOREIGN KEY (`traceId`) REFERENCES `Trace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
