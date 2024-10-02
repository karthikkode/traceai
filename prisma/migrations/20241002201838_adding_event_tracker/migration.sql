/*
  Warnings:

  - You are about to drop the `EventData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `EventData`;

-- CreateTable
CREATE TABLE `eventData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,
    `tagName` VARCHAR(191) NOT NULL,
    `elementId` VARCHAR(191) NULL,
    `classList` VARCHAR(191) NULL,
    `innerText` VARCHAR(191) NULL,
    `href` VARCHAR(191) NULL,
    `outerHTML` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
