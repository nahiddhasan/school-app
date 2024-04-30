/*
  Warnings:

  - Added the required column `position` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalMarks` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "position" INTEGER NOT NULL,
ADD COLUMN     "totalMarks" INTEGER NOT NULL;
