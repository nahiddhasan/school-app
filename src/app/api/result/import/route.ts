import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { ExamType, ReusltStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

type Subject = {
  name: string;
  marks: number;
};

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

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const className = formData.get("className") as string;
    const section = formData.get("section") as string;
    const examType = formData.get("examType") as ExamType;

    if (!file || !className || !section || !examType) {
      return NextResponse.json(
        { error: "File, className, section, and examType are required" },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const rows = await parseCSV(csvText);

    const currentYear = await prisma.academicYear.findFirst({
      where: { current: true },
    });

    if (!currentYear) {
      return NextResponse.json(
        { error: "No active academic year found" },
        { status: 404 }
      );
    }

    const successList: string[] = [];
    const skippedList: string[] = [];
    const errorList: { student: string; error: string }[] = [];

    const resultData: {
      studentId: string;
      classId: string;
      section: string;
      type: ExamType;
      gpa: number;
      status: ReusltStatus;
      totalMarks: number;
      academicYearId: string;
      subjects: Subject[];
      position: number | null;
    }[] = [];

    for (const row of rows) {
      try {
        const student = await prisma.student.findUnique({
          where: { studentId: parseInt(row.studentId) },
        });

        if (!student) throw new Error(`Student not found: ${row.studentId}`);

        const classObj = await prisma.class.findFirst({
          where: { className },
        });

        if (!classObj) throw new Error(`Class not found: ${className}`);

        const existingResult = await prisma.result.findFirst({
          where: {
            studentId: student.id,
            academicYearId: currentYear.id,
            type: examType,
          },
        });

        if (existingResult) {
          skippedList.push(row.studentId);
          continue;
        }

        const subjects: Subject[] = [];
        const entries = Object.entries(row);

        for (let i = 4; i < entries.length; i += 2) {
          const subject = (entries[i][1] as string)?.trim();
          const marks = Number(entries[i + 1]?.[1]);
          if (subject && !isNaN(marks)) {
            subjects.push({ name: subject, marks });
          }
        }

        const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
        const gpa = parseFloat(
          ((totalMarks / (subjects.length * 100)) * 5).toFixed(2)
        );
        const hasFailedSubject = subjects.some((subject) => subject.marks < 33);
        const status = hasFailedSubject
          ? ReusltStatus.FAILED
          : ReusltStatus.PASSED;

        resultData.push({
          studentId: student.id,
          classId: classObj.id,
          section,
          type: examType,
          gpa,
          status,
          totalMarks,
          academicYearId: currentYear.id,
          subjects,
          position: null,
        });

        successList.push(row.studentId);
      } catch (err: any) {
        errorList.push({
          student: row.studentId ?? "Unknown",
          error: err.message,
        });
      }
    }

    //filter pass or fail
    const passedResults = resultData.filter(
      (r) => r.status === ReusltStatus.PASSED
    );
    const failedResults = resultData.filter(
      (r) => r.status === ReusltStatus.FAILED
    );

    //sort
    passedResults.sort((a, b) => b.totalMarks - a.totalMarks);
    passedResults.forEach((r, index) => {
      r.position = index + 1;
    });

    //combine result
    const finalResults = [...passedResults, ...failedResults];

    //insert
    for (const result of finalResults) {
      await prisma.result.create({
        data: result,
      });
    }

    return NextResponse.json({
      success: `Import completed: ${successList.length} imported, ${skippedList.length} skipped, ${errorList.length} failed.`,
      details: {
        imported: successList,
        skipped: skippedList,
        errors: errorList,
      },
    });
  } catch (error: any) {
    console.error("Result import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
