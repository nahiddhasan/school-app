import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }

    const currentYear = await prisma.academicYear.findFirst({
      where: { current: true, schoolId: session.user.schoolId },
    });

    if (!currentYear) {
      return NextResponse.json(
        { error: "No active academic year found" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentYear);
  } catch (error) {
    console.error("Failed to fetch academic years:", error);
    return NextResponse.json(
      { error: "Failed to fetch academic years" },
      { status: 500 }
    );
  }
};
