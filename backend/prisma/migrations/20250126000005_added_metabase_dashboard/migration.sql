-- CreateTable
CREATE TABLE "MetabaseDashboards" (
    "id" TEXT NOT NULL,
    "dashboardName" TEXT NOT NULL,
    "cardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetabaseDashboards_pkey" PRIMARY KEY ("id")
);
