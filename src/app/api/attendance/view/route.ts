import { AttendanceStatus } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { Role } from "@prisma/client";
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
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = Math.min(
      parseInt(searchParams.get("pageSize") || "10"),
      50
    );
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
      where: { className },
    });

    if (!classObj) {
      return NextResponse.json({ error: "Class not found!" }, { status: 404 });
    }

    const isAdmin = session.user.role === Role.ADMIN;
    let isAssigned = null;

    if (session.user.teacherId) {
      isAssigned = await prisma.assignedAttendanceTeacher.findFirst({
        where: {
          teacherId: Number(session.user.teacherId),
          classId: classObj.id,
          section,
        },
      });
    }

    if (!isAdmin && !isAssigned) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Step 1: Get student IDs enrolled in this class/section/year
    const allEnrolledStudents = await prisma.enrollment.findMany({
      where: {
        classId: classObj.id,
        section,
        academicYearId,
      },
      select: {
        studentId: true,
      },
    });

    const studentIds = allEnrolledStudents.map((e) => e.studentId);
    const totalStudents = studentIds.length;

    const paginatedStudentIds = studentIds.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    // Step 2: Get attendance records for those students
    const sessions = await prisma.attendanceSession.findMany({
      where: {
        classId: classObj.id,
        section,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { date: "asc" },
      include: {
        records: {
          where: {
            studentId: { in: paginatedStudentIds },
          },
          include: {
            student: {
              select: {
                studentId: true,
                fullName: true,
                enrollments: {
                  where: { academicYearId },
                  select: { classRoll: true },
                },
              },
            },
          },
        },
      },
    });

    // Step 3: Map results by student
    type AttendanceRecord = {
      studentId: number;
      classRoll: number;
      fullName: string;
      attendance: Record<string, AttendanceStatus>;
    };

    const attendanceMap: Record<number, AttendanceRecord> = {};

    for (const session of sessions) {
      const dateStr = session.date.toISOString().split("T")[0];
      for (const record of session.records) {
        const sid = record.student.studentId;
        if (!attendanceMap[sid]) {
          attendanceMap[sid] = {
            studentId: sid,
            classRoll: record.student.enrollments[0]?.classRoll || 0,
            fullName: record.student.fullName,
            attendance: {},
          };
        }
        attendanceMap[sid].attendance[dateStr] = record.status;
      }
    }

    const attendanceList = Object.values(attendanceMap);

    return NextResponse.json({ attendanceList, totalStudents });
  } catch (error) {
    console.error("[GET MONTHLY ATTENDANCE ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
