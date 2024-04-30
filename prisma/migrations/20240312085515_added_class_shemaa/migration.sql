/*
  Warnings:

  - You are about to drop the `StudentAdmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "StudentAdmission";

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" INTEGER NOT NULL,
    "classRoll" INTEGER NOT NULL,
    "classId" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "doa" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "bloodGroup" TEXT,
    "studentImg" TEXT,
    "address" TEXT,
    "others" TEXT,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "fatherPhone" TEXT NOT NULL,
    "gurdianName" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "gurdianPhone" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "className" TEXT NOT NULL,
    "sectionName" TEXT[],

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_classId_key" ON "Student"("classId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
