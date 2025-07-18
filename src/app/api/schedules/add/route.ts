import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { scheduleSchema } from "@/lib/zodSchema";
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

    if (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const parsed = scheduleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      className: classId,
      dayOfWeek,
      endTime,
      section,
      startTime,
      subject: subjectId,
      teacher: teacherId,
    } = parsed.data;

    // add schedule for teacher
    const newSchedule = await prisma.weeklySchedule.create({
      data: {
        schoolId: session.user.schoolId,
        classId,
        section,
        subjectId,
        teacherId: Number(teacherId),
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
      },
    });
    return NextResponse.json({
      success: "Schedule created successfully",
      schedule: newSchedule,
    });
  } catch (error) {
    console.error("[ADMISSION_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};
