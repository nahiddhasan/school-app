/*
  Warnings:

  - A unique constraint covering the columns `[year,schoolId]` on the table `AcademicYear` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AcademicYear_year_key";

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_year_schoolId_key" ON "AcademicYear"("year", "schoolId");
