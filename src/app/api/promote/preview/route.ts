import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const className = searchParams.get("className");
  const section = searchParams.get("section");

  if (!className || !section) {
    return NextResponse.json([]);
  }

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const currentYear = await prisma.academicYear.findFirst({
      where: { current: true },
    });
    if (!currentYear) {
      return NextResponse.json(
        { error: "Current Year not found!" },
        { status: 400 }
      );
    }
    // Get enrollments matching class, section, and year
    const enrollments = await prisma.enrollment.findMany({
      where: {
        academicYearId: currentYear.id,
        class: { className },
        section,
      },
      include: {
        student: true,
        class: true,
      },
    });

    const studentIds = enrollments.map((e) => e.studentId);

    // Get results for those students
    const results = await prisma.result.findMany({
      where: {
        academicYearId: currentYear.id,
        studentId: { in: studentIds },
        type: "FINAL",
      },
      orderBy: { position: "asc" },
    });

    // Merge student + result data
    const students = enrollments.map((enroll) => {
      const result = results.find((r) => r.studentId === enroll.studentId);
      return {
        id: enroll.student.id,
        studentId: enroll.student.studentId,
        fullName: enroll.student.fullName,
        classRoll: enroll.classRoll,
        className: enroll.class.className,
        section: enroll.section,
        gpa: result?.gpa ?? null,
        position: result?.position ?? null,
        status: result?.status ?? "N/A",
      };
    });

    students.sort((a, b) => {
      if (a.position === null && b.position === null) return 0;
      if (a.position === null) return 1;
      if (b.position === null) return -1;
      return a.position - b.position;
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Preview fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load student preview" },
      { status: 500 }
    );
  }
};
