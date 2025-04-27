/*
  Warnings:

  - A unique constraint covering the columns `[year]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "sessionName" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Session_year_key" ON "Session"("year");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_sessionName_fkey" FOREIGN KEY ("sessionName") REFERENCES "Session"("year") ON DELETE RESTRICT ON UPDATE CASCADE;
