import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { scheduleSchema } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

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

    const schedule = await prisma.weeklySchedule.findUnique({
      where: {
        id,
        schoolId: session.user.schoolId,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Failed to fetch schedule data:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule data" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  const body = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Schedule ID is required" },
      { status: 400 }
    );
  }

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
        { status: 401 }
      );
    }

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

    await prisma.weeklySchedule.update({
      where: {
        id,
        schoolId: session.user.schoolId,
      },
      data: {
        classId,
        section,
        subjectId,
        teacherId: Number(teacherId),
        dayOfWeek: Number(dayOfWeek),
      },
    });

    return NextResponse.json({
      success: "Update Successful",
    });
  } catch (error) {
    console.error("Failed to update schedule:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Schedule ID is required" },
      { status: 400 }
    );
  }

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
        { status: 401 }
      );
    }

    await prisma.weeklySchedule.delete({
      where: {
        id,
        schoolId: session.user.schoolId,
      },
    });

    return NextResponse.json({
      success: "Delete Successful",
    });
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    return NextResponse.json(
      { error: "Failed to delete schedule" },
      { status: 500 }
    );
  }
};
