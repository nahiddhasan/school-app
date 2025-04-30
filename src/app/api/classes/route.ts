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

    const classes = await prisma.class.findMany();

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Failed to fetch Classes:", error);
    return NextResponse.json(
      { message: "Failed to fetch classes" },
      { status: 500 }
    );
  }
};
