import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { addTeacherSchema } from "@/lib/zodSchema";
import bcrypt from "bcryptjs";
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

    if (session.user.role !== "SUPERADMIN" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You are not authorized" },
        { status: 403 }
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
    } = parsed.data;

    const existingTeacher = await prisma.teacher.findFirst({
      where: {
        email,
        phone: phone.toString(),
        schoolId: session.user.schoolId,
      },
    });

    if (existingTeacher) {
      return NextResponse.json(
        { error: "Teacher already exist." },
        { status: 409 }
      );
    }
    const defaultPassword = await bcrypt.hash("teacher123", 10);

    // create teacher and user in a transaction
    await prisma.$transaction(async (prisma) => {
      // create teacher
      const teacher = await prisma.teacher.create({
        data: {
          schoolId: session.user.schoolId,
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

      // create user associated with the teacher
      await prisma.user.create({
        data: {
          schoolId: session.user.schoolId,
          name: teacher.name,
          password: defaultPassword,
          image: teacher.profileImg,
          email,
          role: "TEACHER",
          teacherId: teacher.teacherId,
        },
      });
    });

    return NextResponse.json({
      success: "Teacher added successfully",
    });
  } catch (error) {
    console.error("[TEACHER_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Something went wrong, try again later." },
      { status: 500 }
    );
  }
};
