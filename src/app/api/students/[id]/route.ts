import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { newAdmissionSchema } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id: studentId } = params;

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const { selectedYearId } = Object.fromEntries(searchParams.entries());

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }

    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        enrollments: {
          where: {
            academicYearId: selectedYearId,
          },
          include: {
            class: true,
          },
        },
        results: {
          where: {
            academicYearId: selectedYearId,
          },
          include: {
            academicYear: {
              select: {
                id: true,
                year: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Failed to fetch student data:", error);
    return NextResponse.json(
      { error: "Failed to fetch student data" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id: studentId } = params;
  const body = await req.json();

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 }
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const { selectedYearId } = Object.fromEntries(searchParams.entries());

  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }

    const currentYear = await prisma.academicYear.findFirst({
      where: { current: true },
    });

    if (!currentYear) {
      return NextResponse.json(
        { error: "Current academic year not found!" },
        { status: 404 }
      );
    }

    if (selectedYearId !== currentYear.id) {
      return NextResponse.json(
        { error: "Not allowed to update previous data" },
        { status: 403 }
      );
    }
    // Transform dob and doa to Date format
    const transformedBody = {
      ...body,
      dob: new Date(body.dob),
      doa: new Date(body.doa),
    };

    const parsed = newAdmissionSchema.safeParse(transformedBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      fullName,
      gender,
      dob,
      doa,
      mobile,
      bloodGroup,
      studentImg,
      address,
      others,
      fatherName,
      motherName,
      fatherPhone,
      gurdianName,
      gurdianPhone,
      relation,
      className,
      section,
      classRoll,
    } = parsed.data;

    const enrollmentClass = await prisma.class.findUnique({
      where: { className },
    });

    if (!enrollmentClass) {
      return NextResponse.json(
        { error: "Invalid class name provided" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.student.update({
        where: { id: studentId },
        data: {
          fullName,
          gender,
          dob: new Date(dob),
          doa: new Date(doa),
          mobile,
          bloodGroup,
          studentImg,
          address,
          others,
          fatherName,
          motherName,
          fatherPhone,
          gurdianName,
          gurdianPhone,
          relation,
        },
      });

      await tx.enrollment.updateMany({
        where: {
          studentId,
          academicYearId: currentYear.id,
        },
        data: {
          section,
          classRoll,
          classId: enrollmentClass.id,
        },
      });
    });

    return NextResponse.json({
      success: "Update Successful",
    });
  } catch (error) {
    console.error("Failed to update student data:", error);
    return NextResponse.json(
      { error: "Failed to update student data" },
      { status: 500 }
    );
  }
};
