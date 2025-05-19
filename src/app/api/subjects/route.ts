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

    const subjects = await prisma.subject.findMany();

    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    return NextResponse.json(
      { message: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
};
