// import { ExamType, ReusltStatus } from "@/app/generated/prisma";
// import { auth } from "@/auth";
// import { prisma } from "@/lib/connect";
// import { NextRequest, NextResponse } from "next/server";
// import Papa from "papaparse";

// type Subject = {
//   name: string;
//   marks: number;
// };

// type ParsedRow = {
//   classId: string;
//   studentDbId: string;
//   section: string;
//   type: ExamType;
//   gpa: number;
//   status: ReusltStatus;
//   totalMarks: number;
//   academicYearId: string;
//   subjects: Subject[];
// };

// const parseCSV = (csvText: string): Promise<any[]> => {
//   return new Promise((resolve, reject) => {
//     Papa.parse(csvText, {
//       header: true,
//       skipEmptyLines: true,
//       complete: (results) => resolve(results.data as any[]),
//       error: reject,
//     });
//   });
// };

// export const POST = async (req: NextRequest) => {
//   try {
//     const session = await auth();
//     if (!session || session.user.role !== "ADMIN") {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: session ? 403 : 401 }
//       );
//     }

//     const formData = await req.formData();
//     const file = formData.get("file") as File;
//     const className = formData.get("className") as string;
//     const section = formData.get("section") as string;
//     const examType = formData.get("examType") as ExamType;

//     if (!file || !className || !section || !examType) {
//       return NextResponse.json(
//         { error: "Missing file, className, section, or examType" },
//         { status: 400 }
//       );
//     }

//     const csvText = await file.text();
//     const rows = await parseCSV(csvText);

//     const currentYear = await prisma.academicYear.findFirst({
//       where: { current: true },
//     });

//     if (!currentYear) {
//       return NextResponse.json(
//         { error: "No active academic year found" },
//         { status: 404 }
//       );
//     }

//     const classObj = await prisma.class.findFirst({
//       where: { className },
//     });

//     if (!classObj) {
//       return NextResponse.json(
//         { error: `Class '${className}' not found` },
//         { status: 404 }
//       );
//     }

//     const resultsToInsert: ParsedRow[] = [];

//     for (const row of rows) {
//       try {
//         const student = await prisma.student.findUnique({
//           where: { studentId: parseInt(row.studentId) },
//         });

//         if (!student) {
//           console.warn(`Skipping unknown student: ${row.studentId}`);
//           continue;
//         }

//         const subjects: Subject[] = [];
//         const entries = Object.entries(row);

//         for (let i = 2; i < entries.length; i += 2) {
//           const subject = (entries[i][1] as string)?.trim();
//           const marks = Number(entries[i + 1]?.[1]);

//           if (subject && !isNaN(marks)) {
//             subjects.push({ name: subject, marks });
//           }
//         }

//         const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
//         const gpa = parseFloat(
//           ((totalMarks / (subjects.length * 100)) * 5).toFixed(2)
//         );
//         const hasFailedSubject = subjects.some((subject) => subject.marks < 33);
//         const status = hasFailedSubject
//           ? ReusltStatus.FAILED
//           : ReusltStatus.PASSED;

//         resultsToInsert.push({
//           studentDbId: student.id,
//           classId: classObj.id,
//           section,
//           type: examType,
//           gpa,
//           status,
//           totalMarks,
//           academicYearId: currentYear.id,
//           subjects,
//         });
//       } catch (err) {
//         console.error(`Error parsing row: ${JSON.stringify(row)} —`, err);
//       }
//     }

//     // Sort by total marks descending to assign position
//     resultsToInsert.sort((a, b) => b.totalMarks - a.totalMarks);

//     for (let i = 0; i < resultsToInsert.length; i++) {
//       const result = resultsToInsert[i];
//       await prisma.result.create({
//         data: {
//           studentId: result.studentDbId,
//           classId: result.classId,
//           section: result.section,
//           type: result.type,
//           gpa: result.gpa,
//           status: result.status,
//           totalMarks: result.totalMarks,
//           position: i + 1, // 1-based ranking
//           academicYearId: result.academicYearId,
//           subjects: result.subjects,
//         },
//       });
//     }

//     return NextResponse.json({
//       success: "Results imported with successfully!",
//     });
//   } catch (error) {
//     console.error("Import error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };

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

    for (const row of rows) {
      try {
        const student = await prisma.student.findUnique({
          where: { studentId: parseInt(row.studentId) },
        });

        if (!student) {
          throw new Error(`Student not found: ${row.studentId}`);
        }

        const classObj = await prisma.class.findFirst({
          where: { className: row.className },
        });

        if (!classObj) {
          throw new Error(`Class not found: ${row.className}`);
        }

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
        // const status = gpa >= 2.0 ? ReusltStatus.PASSED : ReusltStatus.FAILED;

        await prisma.result.create({
          data: {
            studentId: student.id,
            classId: classObj.id,
            section,
            type: examType,
            gpa,
            status,
            totalMarks,
            academicYearId: currentYear.id,
            subjects,
          },
        });

        successList.push(row.studentId);
      } catch (err: any) {
        errorList.push({
          student: row.studentId ?? "Unknown",
          error: err.message,
        });
      }
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
