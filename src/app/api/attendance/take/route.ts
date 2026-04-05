import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { attendanceSchema } from "@/lib/zodSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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

    const classRecord = await prisma.class.findFirst({
      where: { className: className, schoolId: session.user.schoolId },
    });

    if (!classRecord) {
      return NextResponse.json({ error: "Class not found" }, { status: 400 });
    }

    const assignedTeacher = await prisma.assignedAttendanceTeacher.findFirst({
      where: {
        classId: classRecord.id,
        section,
        teacherId: Number(teacherId),
        schoolId: session.user.schoolId,
      },
    });

    if (!assignedTeacher) {
      return NextResponse.json(
        {
          error:
            "You are not assigned to take attendance for this class and section",
        },
        { status: 403 }
      );
    }
    // Convert date string to Date object
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
        { error: "Attendance can only be taken for today's date" },
        { status: 400 }
      );
    }
    // Check for existing session on the same day, class, and section
    const existingSession = await prisma.attendanceSession.findFirst({
      where: {
        classId: classRecord.id,
        section,
        date: date,
        schoolId: session.user.schoolId,
      },
    });

    if (existingSession) {
      return NextResponse.json(
        {
          error: "Attendance session already exists for this class and section",
        },
        { status: 400 }
      );
    }

    // Create a new attendance session
    const attendanceSession = await prisma.attendanceSession.create({
      data: {
        date,
        classId: classRecord.id,
        section,
        teacherId: parseInt(teacherId),
        schoolId: session.user.schoolId,
      },
    });

    // Create attendance records
    const attendanceData = Object.entries(students).map(
      ([studentId, entry]) => ({
        sessionId: attendanceSession.id,
        studentId: parseInt(studentId),
        status: entry.status,
        note: entry.note || null,
        schoolId: session.user.schoolId,
      })
    );

    // Use createMany with skipDuplicates to avoid duplicate session-student entries
    await prisma.attendanceRecord.createMany({
      data: attendanceData,
      skipDuplicates: true,
    });

    return NextResponse.json({ success: "Attendance saved successfully" });
  } catch (error) {
    console.error("Error saving attendance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
