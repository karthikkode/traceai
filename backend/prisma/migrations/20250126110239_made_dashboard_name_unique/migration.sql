/*
  Warnings:

  - A unique constraint covering the columns `[dashboardName]` on the table `MetabaseDashboards` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MetabaseDashboards_dashboardName_key" ON "MetabaseDashboards"("dashboardName");
