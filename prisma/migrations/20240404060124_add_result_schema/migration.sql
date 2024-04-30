-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "resultId" TEXT;

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gpa" INTEGER NOT NULL,
    "bangla" INTEGER NOT NULL,
    "english" INTEGER NOT NULL,
    "math" INTEGER NOT NULL,
    "islam" INTEGER NOT NULL,
    "science" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
