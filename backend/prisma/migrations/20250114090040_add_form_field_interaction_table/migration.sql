-- CreateTable
CREATE TABLE "FormFieldInteraction" (
    "id" TEXT NOT NULL,
    "form_id" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "field_content" TEXT NOT NULL,
    "field_rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormFieldInteraction_pkey" PRIMARY KEY ("id")
);
