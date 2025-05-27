import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { asignTeacherSchema } from "@/lib/zodSchema";
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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const parsed = asignTeacherSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const { teacher: teacherId, className: classId, section } = parsed.data;

    const alreadyAsigned = await prisma.assignedAttendanceTeacher.findFirst({
      where: {
        classId,
        section,
      },
    });

    if (alreadyAsigned) {
      return NextResponse.json(
        { error: "This class is already assigned" },
        { status: 400 }
      );
    }
    // asign teacher
    await prisma.assignedAttendanceTeacher.create({
      data: {
        teacherId: Number(teacherId),
        classId,
        section,
      },
    });
    return NextResponse.json({
      success: "Teacher Asigned successfully",
    });
  } catch (error) {
    console.error("[ADMISSION_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};
