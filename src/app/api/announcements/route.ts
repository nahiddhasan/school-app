import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "You are not authenticated" },
        { status: 401 }
      );
    }

    const role = session.user.role;

    if (role === "STUDENT") {
      const currentYear = await prisma.academicYear.findFirst({
        where: {
          current: true,
        },
      });

      const student = await prisma.student.findUnique({
        where: { studentId: session.user.studentId },
        include: {
          enrollments: {
            where: {
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
          OR: [{ classId: enrollment.classId }, { classId: null }],
        },
        take: 7,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(announcements);
    } else if (role === "TEACHER" || role === "ADMIN") {
      const announcements = await prisma.announcement.findMany({
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
      { message: "Failed to fetch events" },
      { status: 500 }
    );
  }
};
