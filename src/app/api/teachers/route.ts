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

    const teachers = await prisma.teacher.findMany({
      where: {
        user: {
          isDisabled: false,
        },
      },
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return NextResponse.json(
      { message: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
};
