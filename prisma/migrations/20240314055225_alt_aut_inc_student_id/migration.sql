-- AlterTable
CREATE SEQUENCE student_studentid_seq;
ALTER TABLE "Student" ALTER COLUMN "studentId" SET DEFAULT nextval('student_studentid_seq');
ALTER SEQUENCE student_studentid_seq OWNED BY "Student"."studentId";
ALTER SEQUENCE "student_studentid_seq" RESTART WITH 1001;