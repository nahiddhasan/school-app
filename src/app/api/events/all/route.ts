import { Prisma } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const { search, pageSize, page } = Object.fromEntries(searchParams.entries());

  const pageNum = parseInt(page || "1");
  const initialPageSize = parseInt(pageSize || "10");
  const pageSizes = initialPageSize > 50 ? 50 : initialPageSize;
  const skip = (pageNum - 1) * pageSizes;

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }

    if (
      session.user.role === "SUPERADMIN" ||
      session.user.role === "ADMIN" ||
      session.user.role === "TEACHER"
    ) {
      const filters: Prisma.EventWhereInput = {
        ...(search && {
          title: { contains: search, mode: "insensitive" },
          schoolId: session.user.schoolId,
        }),
      };

      const totalEvents = await prisma.event.count({
        where: filters,
      });
      const events = await prisma.event.findMany({
        where: filters,
        take: pageSizes,
        skip: skip,
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ events, totalEvents });
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
};
