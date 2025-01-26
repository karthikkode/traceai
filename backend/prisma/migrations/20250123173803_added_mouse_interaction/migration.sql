-- CreateTable
CREATE TABLE "MouseMovement" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MouseMovement_pkey" PRIMARY KEY ("id")
);
