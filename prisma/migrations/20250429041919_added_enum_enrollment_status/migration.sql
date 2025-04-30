/*
  Warnings:

  - Changed the type of `status` on the `Enrollment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ADMITED', 'PROMOTED', 'REPEATED', 'LEFT');

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "status",
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL;
