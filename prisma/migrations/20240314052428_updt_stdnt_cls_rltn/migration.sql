/*
  Warnings:

  - You are about to drop the column `classId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[className]` on the table `Class` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `className` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_classId_fkey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "classId",
ADD COLUMN     "className" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Class_className_key" ON "Class"("className");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_className_fkey" FOREIGN KEY ("className") REFERENCES "Class"("className") ON DELETE RESTRICT ON UPDATE CASCADE;
