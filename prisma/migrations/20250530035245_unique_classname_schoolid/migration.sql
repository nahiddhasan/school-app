/*
  Warnings:

  - A unique constraint covering the columns `[className,schoolId]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Class_className_key";

-- CreateIndex
CREATE UNIQUE INDEX "Class_className_schoolId_key" ON "Class"("className", "schoolId");
