/*
  Warnings:

  - You are about to drop the column `resultId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[year]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[className]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId]` on the table `Result` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `className` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_resultId_fkey";

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "className" TEXT NOT NULL,
ADD COLUMN     "studentId" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "resultId";

-- CreateIndex
CREATE UNIQUE INDEX "Result_year_key" ON "Result"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Result_className_key" ON "Result"("className");

-- CreateIndex
CREATE UNIQUE INDEX "Result_studentId_key" ON "Result"("studentId");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_year_fkey" FOREIGN KEY ("year") REFERENCES "Session"("year") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_className_fkey" FOREIGN KEY ("className") REFERENCES "Class"("className") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;
