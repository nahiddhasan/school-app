/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `StudentAdmission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[classRoll]` on the table `StudentAdmission` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `studentId` on the `StudentAdmission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `classRoll` on the `StudentAdmission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "StudentAdmission" DROP COLUMN "studentId",
ADD COLUMN     "studentId" INTEGER NOT NULL,
DROP COLUMN "classRoll",
ADD COLUMN     "classRoll" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StudentAdmission_studentId_key" ON "StudentAdmission"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAdmission_classRoll_key" ON "StudentAdmission"("classRoll");
