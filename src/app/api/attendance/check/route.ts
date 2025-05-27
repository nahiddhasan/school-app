import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const className = searchParams.get("className")!;
  const section = searchParams.get("section")!;
  const attendanceDate = searchParams.get("date")!;

  try {
    const exists = await prisma.attendanceSession.findFirst({
      where: {
        class: { className: className },
        section,
        date: new Date(attendanceDate),
      },
    });

    return NextResponse.json({ taken: !!exists });
  } catch (error) {
    console.log(error);
  }
}
