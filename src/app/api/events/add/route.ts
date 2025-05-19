import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { addEventSchema } from "@/lib/zodSchema";
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

    // add event
    await prisma.event.create({
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
      success: "Event added successfully",
    });
  } catch (error) {
    console.error("[EVENT_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};
