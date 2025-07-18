import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { addAnnouncementSchema } from "@/lib/zodSchema";
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

    const parsed = addAnnouncementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const { desc, title, classId } = parsed.data;

    await prisma.announcement.create({
      data: {
        classId,
        title,
        desc,
        schoolId: session.user.schoolId,
      },
    });

    return NextResponse.json({
      success: "Announcement added successfully",
    });
  } catch (error) {
    console.error("[ANNOUNCEMENT_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};
