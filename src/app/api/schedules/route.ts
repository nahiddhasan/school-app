import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated" },
      { status: 401 }
    );
  }

  const { role, teacherId, studentId } = session.user;

  try {
    if (role === "SUPERADMIN" || role === "ADMIN") {
      const schedules = await prisma.weeklySchedule.findMany({
        where: {
          schoolId: session.user.schoolId,
        },
        include: {
          class: {
            select: {
              className: true,
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
          teacher: {
            select: {
              name: true,
            },
          },
        },
      });
      return NextResponse.json(schedules);
    }

    if (role === "TEACHER") {
      const schedules = await prisma.weeklySchedule.findMany({
        where: { teacherId, schoolId: session.user.schoolId },
        include: {
          class: {
            select: {
              className: true,
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
          teacher: {
            select: {
              name: true,
            },
          },
        },
      });
      return NextResponse.json(schedules);
    }

    if (role === "STUDENT") {
      const currentYear = await prisma.academicYear.findFirst({
        where: {
          current: true,
          schoolId: session.user.schoolId,
        },
      });

      const student = await prisma.student.findUnique({
        where: { studentId, schoolId: session.user.schoolId },
        include: {
          enrollments: {
            where: {
              academicYearId: currentYear?.id,
              schoolId: session.user.schoolId,
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

      const schedules = await prisma.weeklySchedule.findMany({
        where: {
          schoolId: session.user.schoolId,
          classId: enrollment.class.id,
          section: enrollment.section,
        },
        include: {
          class: {
            select: {
              className: true,
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
          teacher: {
            select: {
              name: true,
            },
          },
        },
      });

      return NextResponse.json(schedules);
    }

    return NextResponse.json(
      { error: "Access denied: Role not supported" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
};
