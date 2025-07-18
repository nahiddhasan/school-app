// /api/attendance/export/json/route.ts

import { AttendanceStatus } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const className = searchParams.get("className");
    const section = searchParams.get("section");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const academicYearId = searchParams.get("selectedYearId");

    if (!className || !section || !month || !year || !academicYearId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const monthNum = Number(month);
    const yearNum = Number(year);
    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json(
        { error: "Invalid month or year format. Expected numeric values." },
        { status: 400 }
      );
    }

    const fromDate = startOfMonth(new Date(yearNum, monthNum - 1));
    const toDate = endOfMonth(fromDate);

    const classObj = await prisma.class.findFirst({
      where: { className, schoolId: session.user.schoolId },
    });

    if (!classObj) {
      return NextResponse.json({ error: "Class not found!" }, { status: 404 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const isSuperAdmin = session.user.role === "SUPERADMIN";
    let isAssigned = null;

    if (session.user.teacherId) {
      isAssigned = await prisma.assignedAttendanceTeacher.findFirst({
        where: {
          teacherId: Number(session.user.teacherId),
          classId: classObj.id,
          section,
          schoolId: session.user.schoolId,
        },
      });
    }

    if (!isAdmin && !isSuperAdmin && !isAssigned) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const students = await prisma.student.findMany({
      where: {
        schoolId: session.user.schoolId,
        enrollments: {
          some: {
            classId: classObj.id,
            section,
            academicYearId,
          },
        },
      },
      select: {
        studentId: true,
        fullName: true,
        enrollments: {
          where: { academicYearId, schoolId: session.user.schoolId },
          select: { classRoll: true },
        },
      },
    });

    const sessions = await prisma.attendanceSession.findMany({
      where: {
        classId: classObj.id,
        schoolId: session.user.schoolId,
        section,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { date: "asc" },
      include: {
        records: true,
      },
    });

    // Build attendance map
    type AttendanceRecord = {
      studentId: number;
      fullName: string;
      classRoll: number;
      attendance: Record<string, AttendanceStatus>;
    };

    const attendanceMap: Record<number, AttendanceRecord> = {};

    for (const student of students) {
      attendanceMap[student.studentId] = {
        studentId: student.studentId,
        fullName: student.fullName,
        classRoll: student.enrollments[0]?.classRoll || 0,
        attendance: {},
      };
    }

    for (const session of sessions) {
      const dateStr = session.date.toISOString().split("T")[0];
      for (const record of session.records) {
        if (attendanceMap[record.studentId]) {
          attendanceMap[record.studentId].attendance[dateStr] =
            record.status as AttendanceStatus;
        }
      }
    }

    const attendanceList = Object.values(attendanceMap);

    return NextResponse.json(attendanceList);
  } catch (error) {
    console.error("[EXPORT JSON ATTENDANCE ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
