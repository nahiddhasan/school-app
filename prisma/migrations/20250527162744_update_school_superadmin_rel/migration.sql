/*
  Warnings:

  - Added the required column `superAdminId` to the `SchoolInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SchoolInfo" ADD COLUMN     "superAdminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SchoolInfo" ADD CONSTRAINT "SchoolInfo_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
