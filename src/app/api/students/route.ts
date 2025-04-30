import { Prisma } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const { className, section, search, selectedYearId, pageSize, page } =
    Object.fromEntries(searchParams.entries());

  const pageNum = parseInt(page || "1");
  const initialPageSize = parseInt(pageSize || "10");
  const pageSizes = initialPageSize > 50 ? 50 : initialPageSize;
  const skip = (pageNum - 1) * pageSizes;

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!selectedYearId) {
      return NextResponse.json(
        { message: "Academic Year ID is required" },
        { status: 400 }
      );
    }

    // 👉 Check if both className and section are provided
    if (!className) {
      return NextResponse.json({ students: [], totalStudents: 0 });
    }

    // Filters only apply when className and section are available
    const filters: Prisma.StudentWhereInput = {
      enrollments: {
        some: {
          academicYearId: selectedYearId,
          class: { className: className },
          section: section,
          ...(search && {
            classRoll: !isNaN(parseInt(search)) ? parseInt(search) : undefined,
          }),
        },
      },
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          {
            studentId: !isNaN(parseInt(search)) ? parseInt(search) : undefined,
          },
        ],
      }),
    };

    // Total students
    const totalStudents = await prisma.student.count({
      where: filters,
    });

    // Students paginated
    const students = await prisma.student.findMany({
      where: filters,
      take: pageSizes,
      skip: skip,
      include: {
        enrollments: {
          where: {
            academicYearId: selectedYearId,
          },
          include: {
            class: true,
            academicYear: true,
          },
        },
      },
    });

    return NextResponse.json({ students, totalStudents });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
