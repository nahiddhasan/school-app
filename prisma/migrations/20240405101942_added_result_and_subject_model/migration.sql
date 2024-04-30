/*
  Warnings:

  - You are about to drop the column `bangla` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `english` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `islam` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `math` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `science` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "bangla",
DROP COLUMN "english",
DROP COLUMN "islam",
DROP COLUMN "math",
DROP COLUMN "science",
ALTER COLUMN "gpa" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
