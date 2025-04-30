import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "You are not authenticated" },
        { status: 401 }
      );
    }

    const currentYear = await prisma.academicYear.findFirst({
      where: { current: true },
    });

    if (!currentYear) {
      return NextResponse.json(
        { message: "No active academic year found" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentYear);
  } catch (error) {
    console.error("Failed to fetch academic years:", error);
    return NextResponse.json(
      { message: "Failed to fetch academic years" },
      { status: 500 }
    );
  }
};
