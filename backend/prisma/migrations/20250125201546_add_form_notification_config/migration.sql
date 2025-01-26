-- CreateTable
CREATE TABLE "FormNotificationConfig" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "dropOffPercentage" DOUBLE PRECISION NOT NULL,
    "notificationFrequency" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormNotificationConfig_pkey" PRIMARY KEY ("id")
);
