import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { newAdmissionSchema } from "@/lib/zodSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (
  req: NextRequest,
  { params }: { params: { studentId: string } }
) => {
  const { studentId } = params;

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
      where: {
        current: true,
      },
    });
    const academicYear = await prisma.academicYear.findFirst({
      where: {
        id: selectedYearId ? selectedYearId : currentYear?.id,
      },
    });

    const student = await prisma.student.findUnique({
      where: {
        studentId: Number(studentId),
      },
      include: {
        enrollments: {
          where: {
            academicYearId: academicYear?.id,
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

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { studentId: string } }
) => {
  const { studentId } = params;

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
      password,
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

    const student = await prisma.student.findUnique({
      where: {
        studentId: Number(studentId),
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Invalid Student Found!" },
        { status: 404 }
      );
    }
    const updatedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    await prisma.$transaction(async (tx) => {
      const updatedStudent = await tx.student.update({
        where: { studentId: student.studentId },
        data: {
          fullName,
          gender,
          dob: new Date(dob),
          doa: new Date(doa),
          mobile: String(mobile),
          bloodGroup,
          studentImg,
          address,
          others,
          fatherName,
          motherName,
          fatherPhone: String(fatherPhone),
          gurdianName,
          gurdianPhone: String(gurdianPhone),
          relation,
        },
      });

      await tx.enrollment.updateMany({
        where: {
          studentId: student.studentId,
          academicYearId: currentYear.id,
        },
        data: {
          section,
          classRoll,
          classId: enrollmentClass.id,
        },
      });

      await tx.user.update({
        where: {
          studentId: student.studentId,
        },
        data: {
          name: updatedStudent.fullName,
          password: updatedPassword,
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
