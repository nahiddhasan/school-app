import { Prisma } from "@/app/generated/prisma";
import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const { className, section, selectedYearId } = Object.fromEntries(
    searchParams.entries()
  );

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!selectedYearId) {
      return NextResponse.json(
        { message: "Academic Year ID is required" },
        { status: 400 }
      );
    }

    if (!className) {
      return NextResponse.json(
        { error: "Class name is required" },
        { status: 400 }
      );
    }

    const academicYear = await prisma.academicYear.findFirst({
      where: {
        id: selectedYearId,
      },
    });

    if (!academicYear) {
      return NextResponse.json(
        { error: "Academic Year not found!" },
        { status: 404 }
      );
    }

    const filters: Prisma.StudentWhereInput = {
      enrollments: {
        some: {
          academicYearId: selectedYearId,
          class: { className: className },
          ...(section && { section }),
        },
      },
    };

    const students = await prisma.student.findMany({
      where: filters,
      include: {
        enrollments: {
          where: {
            academicYearId: selectedYearId,
          },
          include: {
            class: {
              select: {
                className: true,
              },
            },
            academicYear: {
              select: {
                year: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: "Success!", students });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
};
