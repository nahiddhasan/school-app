import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const className = searchParams.get("className")!;
  const section = searchParams.get("section")!;
  const attendanceDate = searchParams.get("date")!;
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "You are not authenticated" },
      { status: 401 }
    );
  }
  try {
    const exists = await prisma.attendanceSession.findFirst({
      where: {
        class: { className: className },
        section,
        date: new Date(attendanceDate),
        schoolId: session.user.schoolId,
      },
    });

    return NextResponse.json({ taken: !!exists });
  } catch (error) {
    console.error("[ADMISSION_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
}
