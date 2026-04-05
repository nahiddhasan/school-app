/*
  Warnings:

  - A unique constraint covering the columns `[domainPrefix]` on the table `SchoolInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SchoolInfo_domainPrefix_key" ON "SchoolInfo"("domainPrefix");
