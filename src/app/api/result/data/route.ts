import { Prisma } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { SampleResultSchema } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = SampleResultSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: parsed.error.format() },
        { status: 400 }
      );
    }
    const { className, section } = parsed.data;

    const currentYear = await prisma.academicYear.findFirst({
      where: { current: true },
    });

    if (!currentYear) {
      return NextResponse.json(
        { error: "No active academic year found" },
        { status: 404 }
      );
    }

    const filters: Prisma.StudentWhereInput = {
      enrollments: {
        some: {
          academicYearId: currentYear.id,
          class: { className: className },
          section: section,
        },
      },
    };
    // Example: Fetch studentId, name, class, section, gender, email
    const students = await prisma.student.findMany({
      where: filters,
      select: {
        fullName: true,
        studentId: true,
      },
    });

    // Flatten data
    const flatData = students.map((s) => ({
      student_name: s.fullName,
      studentId: s.studentId,
      subject1: "",
      marks1: "",
      subject2: "",
      marks2: "",
      subject3: "",
      marks3: "",
      subject4: "",
      marks4: "",
    }));

    const csv = Papa.unparse(flatData);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="students_demo_result.csv"`,
      },
    });
  } catch (error) {
    console.error("Export failed:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
