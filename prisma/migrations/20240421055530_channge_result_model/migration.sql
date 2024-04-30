/*
  Warnings:

  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_resultId_fkey";

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "subjects" JSONB[];

-- DropTable
DROP TABLE "Subject";
