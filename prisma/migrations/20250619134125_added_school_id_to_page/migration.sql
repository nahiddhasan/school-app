/*
  Warnings:

  - Added the required column `schoolId` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "schoolId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Page_schoolId_idx" ON "Page"("schoolId");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "SchoolInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
