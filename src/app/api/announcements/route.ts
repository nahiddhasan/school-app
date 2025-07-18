import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }

    const role = session.user.role;

    if (role === "STUDENT") {
      const currentYear = await prisma.academicYear.findFirst({
        where: {
          current: true,
          schoolId: session.user.schoolId,
        },
      });

      const student = await prisma.student.findUnique({
        where: {
          studentId: session.user.studentId,
          schoolId: session.user.schoolId,
        },
        include: {
          enrollments: {
            where: {
              schoolId: session.user.schoolId,
              academicYearId: currentYear?.id,
            },
            include: {
              class: true,
            },
          },
        },
      });

      const enrollment = student?.enrollments[0];

      if (!enrollment || !enrollment.class) {
        return NextResponse.json(
          { error: "No class or section found for the student" },
          { status: 404 }
        );
      }

      const announcements = await prisma.announcement.findMany({
        where: {
          schoolId: session.user.schoolId,
          OR: [{ classId: enrollment.classId }, { classId: null }],
        },
        take: 7,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(announcements);
    } else if (
      role === "TEACHER" ||
      role === "ADMIN" ||
      role === "SUPERADMIN"
    ) {
      const announcements = await prisma.announcement.findMany({
        where: {
          schoolId: session.user.schoolId,
        },
        take: 7,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(announcements);
    } else {
      return NextResponse.json(
        { error: "Access restricted to teachers and admins" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
};
