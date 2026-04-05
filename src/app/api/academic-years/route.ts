import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const years = await prisma.academicYear.findMany({
      where: {
        schoolId: session.user.schoolId,
      },
      orderBy: {
        year: "desc",
      },
    });

    return NextResponse.json(years);
  } catch (error) {
    console.error("Failed to fetch academic years:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
