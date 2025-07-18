import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { addTeacherSchema } from "@/lib/zodSchema";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }

    if (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }
    const body = await req.json();

    const transformedBody = {
      ...body,
      dob: new Date(body.dob),
    };

    const parsed = addTeacherSchema.safeParse(transformedBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      designation,
      dob,
      email,
      gender,
      name,
      phone,
      subject,
      address,
      bloodGroup,
      department,
      profileImg,
      password,
    } = parsed.data;

    const teacher = await prisma.teacher.findUnique({
      where: {
        teacherId: Number(id),
        schoolId: session.user.schoolId,
      },
    });
    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not Found!" },
        { status: 404 }
      );
    }

    const updatedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    // update teacher
    await prisma.$transaction(async (prisma) => {
      // Update teacher
      const updatedTeacher = await prisma.teacher.update({
        where: {
          teacherId: teacher.teacherId,
          schoolId: session.user.schoolId,
        },
        data: {
          designation,
          dob,
          email,
          gender,
          name,
          phone: String(phone),
          subject,
          address,
          bloodGroup,
          department,
          profileImg,
        },
      });

      await prisma.user.update({
        where: {
          teacherId: teacher.teacherId,
          schoolId: session.user.schoolId,
        },
        data: {
          email: updatedTeacher.email,
          name: updatedTeacher.name,
          password: updatedPassword,
        },
      });
    });

    return NextResponse.json({
      success: "Teacher updated successfully",
    });
  } catch (error) {
    console.error("[TEACHER_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};
