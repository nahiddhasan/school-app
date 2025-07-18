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

    const filters: Prisma.TeacherWhereInput = {
      schoolId: session.user.schoolId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          {
            teacherId: !isNaN(parseInt(search)) ? parseInt(search) : undefined,
          },
        ],
      }),
    };

    // Total students
    const totalTeachers = await prisma.teacher.count({
      where: filters,
    });

    // Students paginated
    const teachers = await prisma.teacher.findMany({
      where: filters,
      take: pageSizes,
      skip: skip,
      include: {
        user: {
          select: {
            isDisabled: true,
          },
        },
      },
    });

    return NextResponse.json({ teachers, totalTeachers });
  } catch (error) {
    console.error("Failed to fetch teachers:", error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
};
