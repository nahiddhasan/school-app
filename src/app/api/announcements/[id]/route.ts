import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { addAnnouncementSchema } from "@/lib/zodSchema";
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

    if (session.user.role !== "ADMIN") {
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

    await prisma.announcement.update({
      where: {
        id,
      },
      data: {
        classId,
        title,
        desc,
      },
    });

    return NextResponse.json({
      success: "Announcement updated successfully",
    });
  } catch (error) {
    console.error("[ANNOUNCEMENT_UPDATE_ERROR]", error);
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

    await prisma.announcement.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("[ANNOUNCEMENT_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};
