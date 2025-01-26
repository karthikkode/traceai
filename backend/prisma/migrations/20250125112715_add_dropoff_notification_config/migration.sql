-- CreateTable
CREATE TABLE "DropoffNotificationConfig" (
    "id" TEXT NOT NULL,
    "urlPath" TEXT NOT NULL,
    "urlGroupName" TEXT NOT NULL,
    "dropoffPercentage" DOUBLE PRECISION NOT NULL,
    "notificationFrequency" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DropoffNotificationConfig_pkey" PRIMARY KEY ("id")
);
