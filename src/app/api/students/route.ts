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
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    const currentYear = await prisma.academicYear.findFirst({
      where: {
        current: true,
        schoolId: session.user.schoolId,
      },
    });

    if (!className) {
      return NextResponse.json({ students: [], totalStudents: 0 });
    }

    const filters: Prisma.StudentWhereInput = {
      schoolId: session.user.schoolId,
      enrollments: {
        some: {
          academicYearId: selectedYearId ?? currentYear?.id,
          class: { className: className },
          ...(section && { section }),
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

    const totalStudents = await prisma.student.count({
      where: filters,
    });

    const students = await prisma.student.findMany({
      where: filters,
      take: pageSizes,
      skip: skip,
      include: {
        enrollments: {
          where: {
            academicYearId: selectedYearId,
            schoolId: session.user.schoolId,
          },
          include: {
            class: true,
            academicYear: true,
          },
        },
      },
    });

    students.sort((a, b) => {
      const aRoll = a.enrollments[0]?.classRoll ?? 0;
      const bRoll = b.enrollments[0]?.classRoll ?? 0;
      return aRoll - bRoll;
    });

    return NextResponse.json({ students, totalStudents });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
