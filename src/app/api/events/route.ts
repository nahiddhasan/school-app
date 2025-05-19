import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();
    const searchParams = req.nextUrl.searchParams;
    const selectedDateParam = searchParams.get("selectedDate");

    if (!session) {
      return NextResponse.json(
        { message: "You are not authenticated" },
        { status: 401 }
      );
    }

    const role = session.user.role;

    // Parse selected date
    const selectedDate = selectedDateParam
      ? new Date(selectedDateParam)
      : new Date();

    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid selected date" },
        { status: 400 }
      );
    }

    // Start and end of the selected date
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const now = new Date();

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

      const events = await prisma.event.findMany({
        where: {
          AND: [
            {
              OR: [{ classId: enrollment.classId }, { classId: null }],
            },
            {
              date: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
            {
              endTime: {
                gt: now,
              },
            },
          ],
        },
      });

      return NextResponse.json(events);
    } else if (role === "TEACHER" || role === "ADMIN") {
      const events = await prisma.event.findMany({
        where: {
          AND: [
            {
              date: {
                gte: dayStart,
                lte: dayEnd,
              },
            },
            {
              endTime: {
                gt: now,
              },
            },
          ],
        },
      });

      return NextResponse.json(events);
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
