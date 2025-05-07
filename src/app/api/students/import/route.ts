import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

// Helper: Parse CSV text to JSON
export const parseCSV = (csvText: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data as any[]),
      error: reject,
    });
  });
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Handle FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const className = formData.get("className") as string;
    const section = formData.get("section") as string;

    if (!file || !className || !section) {
      return NextResponse.json(
        { error: "File, className, and section are required" },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const rows = await parseCSV(csvText);

    // Find current academic year
    const currentYear = await prisma.academicYear.findFirst({
      where: { current: true },
    });

    if (!currentYear) {
      return NextResponse.json(
        { error: "No active academic year found" },
        { status: 404 }
      );
    }

    const skippList: string[] = [];
    const successList: string[] = [];
    const errorList: { student: string; error: string }[] = [];

    for (const row of rows) {
      try {
        const { classRoll, dob, doa, ...studentData } = row;

        const enrollmentClass = await prisma.class.findUnique({
          where: { className },
        });

        if (!enrollmentClass)
          throw new Error(`Invalid class name: ${className}`);

        const existingStudent = await prisma.student.findFirst({
          where: {
            fullName: studentData.fullName,
            dob: new Date(dob),
            fatherName: studentData.fatherName,
          },
        });

        if (existingStudent) {
          const alreadyEnrolled = await prisma.enrollment.findFirst({
            where: {
              studentId: existingStudent.studentId,
              academicYearId: currentYear.id,
              classId: enrollmentClass.id,
              section,
            },
          });

          if (alreadyEnrolled) {
            skippList.push(studentData.fullName);
            continue; // Skip importing duplicate
          }
        }

        await prisma.$transaction(async (tx) => {
          const student = existingStudent
            ? existingStudent
            : await tx.student.create({
                data: {
                  ...studentData,
                  dob: new Date(dob),
                  doa: new Date(doa),
                },
              });

          await tx.enrollment.create({
            data: {
              classId: enrollmentClass.id,
              section,
              classRoll: parseInt(classRoll, 10),
              studentId: student.studentId,
              academicYearId: currentYear.id,
              status: "ADMITTED",
            },
          });
        });

        successList.push(studentData.fullName);
      } catch (err: any) {
        errorList.push({
          student: row.fullName ?? "Unknown",
          error: err.message,
        });
      }
    }

    return NextResponse.json({
      success: `Import completed. Success: ${successList.length}, Failed: ${errorList.length}, Skipped: ${skippList.length}`,
      details: {
        skipped: skippList,
        errors: errorList,
      },
    });
  } catch (error: any) {
    console.error("Student import error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
