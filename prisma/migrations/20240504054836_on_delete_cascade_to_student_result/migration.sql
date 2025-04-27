-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_className_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_studentId_fkey";

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_className_fkey" FOREIGN KEY ("className") REFERENCES "Class"("className") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;
