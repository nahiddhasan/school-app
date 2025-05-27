import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { attendanceSchema } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const className = searchParams.get("className");
  const section = searchParams.get("section");
  const attendanceDate = searchParams.get("date");

  if (!className || !section || !attendanceDate) {
    return new NextResponse("Missing required query parameters", {
      status: 400,
    });
  }

  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const currentYear = await prisma.academicYear.findFirst({
      where: {
        current: true,
      },
    });

    const attendance = await prisma.attendanceSession.findFirst({
      where: {
        class: { className },
        section,
        date: new Date(attendanceDate),
      },
      include: {
        records: {
          include: {
            student: {
              include: {
                enrollments: {
                  where: {
                    academicYearId: currentYear?.id,
                  },
                  select: {
                    classRoll: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!attendance) {
      return NextResponse.json(
        { error: "Attendance not found!" },
        { status: 404 }
      );
    }

    const isAdmin = session.user.role === "ADMIN";
    const isCreator = attendance.teacherId === session.user.teacherId;

    if (!isAdmin && !isCreator) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Reshape the response for frontend clarity
    const responseData = {
      id: attendance.id,
      date: attendance.date,
      teacherId: attendance.teacherId,
      className,
      section,
      records: attendance.records.map((record) => ({
        id: record.student.studentId,
        fullName: record.student.fullName,
        studentId: record.student.studentId,
        classRoll: record.student.enrollments[0]?.classRoll ?? null,
        status: record.status,
        note: record.note ?? "",
      })),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[ATTENDANCE_FETCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = attendanceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid attendance data", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { attendanceDate, className, section, teacherId, students } =
      parsed.data;

    const date = new Date(attendanceDate);

    // Ensure the attendance date is not in the past or future
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    // Compare only the year, month, and day
    if (
      date.getFullYear() !== today.getFullYear() ||
      date.getMonth() !== today.getMonth() ||
      date.getDate() !== today.getDate()
    ) {
      return NextResponse.json(
        { error: "Attendance can only be update for attendance's date" },
        { status: 400 }
      );
    }

    // Find the class ID based on className
    const classObj = await prisma.class.findUnique({
      where: { className: className },
    });

    if (!classObj) {
      return NextResponse.json(
        { error: `Class ${className} not found` },
        { status: 404 }
      );
    }

    const attendanceTeacher = await prisma.assignedAttendanceTeacher.findFirst({
      where: {
        classId: classObj.id,
        section,
        teacherId: Number(teacherId),
      },
    });

    if (!attendanceTeacher) {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
      );
    }

    // Check if session exists
    let sessionRecord = await prisma.attendanceSession.findFirst({
      where: {
        date,
        section,
        classId: classObj.id,
      },
    });

    // If not found, create the session
    if (!sessionRecord) {
      sessionRecord = await prisma.attendanceSession.create({
        data: {
          date,
          section,
          classId: classObj.id,
          teacherId: Number(teacherId),
        },
      });
    }

    // Upsert attendance records
    const updatedRecords = await Promise.all(
      Object.entries(students).map(([studentId, { status, note }]) =>
        prisma.attendanceRecord.upsert({
          where: {
            sessionId_studentId: {
              sessionId: sessionRecord.id,
              studentId: parseInt(studentId),
            },
          },
          update: {
            status,
            note,
          },
          create: {
            sessionId: sessionRecord.id,
            studentId: parseInt(studentId),
            status,
            note,
          },
        })
      )
    );

    return NextResponse.json({
      success: "Attendance updated successfully",
      updatedCount: updatedRecords.length,
    });
  } catch (error) {
    console.error("[ATTENDANCE_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
}
