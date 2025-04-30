// app/api/admission/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { newAdmissionSchema } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
      );
    }

    const body = await req.json();

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

    //Get Current Year
    const currentYear = await prisma.academicYear.findFirst({
      where: {
        current: true,
      },
    });
    if (!currentYear) {
      return NextResponse.json(
        { error: "Current Academic Year not found" },
        { status: 404 }
      );
    }

    // Create Enrollment
    const enrollmentClass = await prisma.class.findFirst({
      where: {
        className,
        sectionName: {
          has: section,
        },
      },
    });

    if (!enrollmentClass) {
      return NextResponse.json(
        { error: "Class or Section not found" },
        { status: 404 }
      );
    }

    //to create student and enrollmet at same time if any fails stop creating both
    const { student, enrollment } = await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
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

      const enrollment = await tx.enrollment.create({
        data: {
          studentId: student.id,
          section,
          classRoll,
          classId: enrollmentClass.id,
          academicYearId: currentYear.id,
          status: "ADMITTED",
        },
      });

      return { student, enrollment };
    });
    return NextResponse.json({
      success: "Student Admission Successful",
    });
  } catch (error) {
    console.error("[ADMISSION_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};
