import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { addEventSchema } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
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
    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }
    const body = await req.json();

    const transformedBody = {
      ...body,
      date: new Date(body.date),
    };

    const parsed = addEventSchema.safeParse(transformedBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const { desc, title, classId, date, startTime, endTime } = parsed.data;

    const event = await prisma.event.findFirst({
      where: { id, schoolId: session.user.schoolId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.endTime && event.endTime <= new Date()) {
      return NextResponse.json(
        { error: "Past events cannot be edited" },
        { status: 403 }
      );
    }

    // update event
    await prisma.event.update({
      where: {
        id,
        schoolId: session.user.schoolId,
      },
      data: {
        classId,
        title,
        desc,
        date,
        startTime: new Date(
          `${date.toISOString().split("T")[0]}T${startTime}:00`
        ),
        endTime: new Date(`${date.toISOString().split("T")[0]}T${endTime}:00`),
      },
    });

    return NextResponse.json({
      success: "Event updated successfully",
    });
  } catch (error) {
    console.error("[EVENT_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
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
    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findFirst({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.endTime && event.endTime <= new Date()) {
      return NextResponse.json(
        { error: "Past events cannot be delete" },
        { status: 403 }
      );
    }

    // update event
    await prisma.event.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: "Event delete successfully",
    });
  } catch (error) {
    console.error("[EVENT_Delete_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};
