import { EnrollmentStatus } from "@/app/generated/prisma";
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

    // Current and Next Academic Year
    const currentYear = await prisma.academicYear.findFirst({
      where: { current: true },
    });
    if (!currentYear) {
      return NextResponse.json(
        { error: "Current academic year not found." },
        { status: 400 }
      );
    }

    const nextYearValue = new Date().getFullYear() + 1;
    const nextYear = await prisma.academicYear.findFirst({
      where: { year: nextYearValue },
    });
    if (!nextYear) {
      return NextResponse.json(
        { error: "Next academic year not found!" },
        { status: 400 }
      );
    }

    // Get current class ID for selected students
    const enrollmentSample = await prisma.enrollment.findFirst({
      where: {
        academicYearId: currentYear.id,
        studentId: { in: studentIds },
      },
      include: {
        class: { select: { className: true } },
      },
    });

    const currentClass = {
      id: enrollmentSample?.classId,
      className: enrollmentSample?.class?.className,
      section: enrollmentSample?.section,
    };

    // Get next class info
    const nextClass = await prisma.class.findFirst({
      where: {
        className,
        sectionName: { has: section },
      },
    });

    if (!nextClass) {
      return NextResponse.json(
        { error: "Provided next class or section is invalid." },
        { status: 400 }
      );
    }

    // All students in the selected current class & section
    const allClassStudents = await prisma.student.findMany({
      where: {
        enrollments: {
          some: {
            academicYearId: currentYear.id,
            class: { className: currentClass.className },
            section: currentClass.section,
          },
        },
      },
      select: { studentId: true },
    });

    const allClassStudentIds = allClassStudents.map((s) => s.studentId);

    // Skip already promoted/repeated students (already enrolled in next year)
    const alreadyEnrolled = await prisma.enrollment.findMany({
      where: {
        academicYearId: nextYear.id,
        studentId: { in: allClassStudentIds },
      },
      select: { studentId: true },
    });

    const alreadyEnrolledIds = new Set(alreadyEnrolled.map((e) => e.studentId));
    const studentIdsToProcess = studentIds.filter(
      (id: number) => !alreadyEnrolledIds.has(id)
    );

    if (studentIdsToProcess.length === 0) {
      return NextResponse.json(
        {
          error:
            "All selected students have already been promoted or repeated.",
        },
        { status: 400 }
      );
    }

    // Determine who was not selected → to be repeated
    const repeatedIds = allClassStudentIds.filter(
      (id: number) => !studentIds.includes(id) && !alreadyEnrolledIds.has(id)
    );

    // Fetch positions
    const results = await prisma.result.findMany({
      where: {
        studentId: { in: studentIdsToProcess },
        academicYearId: currentYear.id,
      },
      select: { studentId: true, position: true },
    });

    const positionMap = new Map(results.map((r) => [r.studentId, r.position]));

    // Promoted students
    const promotedData = studentIdsToProcess.map((studentId: number) => ({
      studentId,
      classId: nextClass.id,
      academicYearId: nextYear.id,
      section,
      classRoll: positionMap.get(studentId) ?? -1,
      status: EnrollmentStatus.PROMOTED,
    }));

    // Repeated students
    const repeatedData = repeatedIds.map((studentId: number) => ({
      studentId,
      classId: currentClass.id,
      academicYearId: nextYear.id,
      section: currentClass.section,
      classRoll: positionMap.get(studentId) ?? -1,
      status: EnrollmentStatus.REPEATED,
    }));

    await prisma.enrollment.createMany({
      data: [...promotedData, ...repeatedData],
    });

    return NextResponse.json({
      success: "Promotion process completed.",
      promotedCount: promotedData.length,
      repeatedCount: repeatedData.length,
      skippedCount: alreadyEnrolledIds.size,
    });
  } catch (error) {
    console.error("[PROMOTION_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong. Try again later." },
      { status: 500 }
    );
  }
};
