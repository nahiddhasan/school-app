import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { studentIds, className, section } = body;

    if (!studentIds?.length) {
      return NextResponse.json(
        { error: "No students selected" },
        { status: 400 }
      );
    }

    if (!className || !section) {
      return NextResponse.json(
        { error: "Class or Section missing" },
        { status: 400 }
      );
    }

    // Current academic year
    const currentYear = await prisma.academicYear.findFirst({
      where: { current: true },
    });

    if (!currentYear) {
      return NextResponse.json(
        { error: "Current academic year not found." },
        { status: 400 }
      );
    }

    // Next academic year
    const nextYearValue = new Date().getFullYear() + 1;
    const nextYear = await prisma.academicYear.findFirst({
      where: { year: nextYearValue },
    });

    if (!nextYear) {
      return NextResponse.json(
        { error: "Next academic year not found! Please create it first." },
        { status: 400 }
      );
    }

    // Get next class info
    const nextClass = await prisma.class.findFirst({
      where: {
        className,
        sectionName: section,
      },
    });

    if (!nextClass) {
      return NextResponse.json(
        { error: "Provided next class or section is invalid." },
        { status: 400 }
      );
    }

    // Get eligible students in current year, class, and section
    const eligibleStudents = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        enrollments: {
          some: {
            academicYearId: currentYear.id,
            class: {
              className,
            },
            section,
          },
        },
      },
    });

    const eligibleStudentIds = eligibleStudents.map((s) => s.id);
    const notPromotedStudentIds = studentIds.filter(
      (id: string) => !eligibleStudentIds.includes(id)
    );

    // Promoted → New class
    const promotedData = eligibleStudentIds.map((studentId) => ({
      studentId,
      classId: nextClass.id,
      academicYearId: nextYear.id,
      section: nextClass.sectionName,
    }));

    // Not Promoted → Same class
    const sameClass = await prisma.class.findFirst({
      where: {
        className,
        sectionName: section,
      },
    });

    if (!sameClass) {
      return NextResponse.json(
        { error: "Could not find current class for repeating students." },
        { status: 400 }
      );
    }

    const repeatedData = notPromotedStudentIds.map((studentId: string) => ({
      studentId,
      classId: sameClass.id,
      academicYearId: nextYear.id,
      section: sameClass.sectionName,
    }));

    // Insert enrollments
    const created = await prisma.enrollment.createMany({
      data: [...promotedData, ...repeatedData],
    });

    return NextResponse.json({
      succees: "Promotion process completed.",
      promotedCount: promotedData.length,
      repeatedCount: repeatedData.length,
    });
  } catch (error) {
    console.error("[PROMOTION_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Try again later." },
      { status: 500 }
    );
  }
};
