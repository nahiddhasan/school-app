import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "You are not authenticated" },
        { status: 401 }
      );
    }
    const isAdmin = session.user.role === "ADMIN";
    const isSuperAdmin = session.user.role === "SUPERADMIN";

    if (isAdmin || isSuperAdmin) {
      const classes = await prisma.class.findMany({
        where: {
          schoolId: session.user.schoolId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return NextResponse.json(classes);
    } else if (session.user.role === "TEACHER") {
      const assignedClass = await prisma.assignedAttendanceTeacher.findMany({
        where: {
          teacherId: Number(session.user.teacherId),
          schoolId: session.user.schoolId,
        },
        include: {
          class: true,
        },
      });

      const classMap = new Map<
        string,
        {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          className: string;
          sectionName: string[];
        }
      >();

      for (const item of assignedClass) {
        const existing = classMap.get(item.classId);

        if (existing) {
          if (!existing.sectionName.includes(item.section)) {
            existing.sectionName.push(item.section);
          }
        } else {
          classMap.set(item.classId, {
            id: item.classId,
            createdAt: item.class.updatedAt,
            updatedAt: item.class.updatedAt,
            className: item.class.className,
            sectionName: [item.section],
          });
        }
      }

      const groupedClasses = Array.from(classMap.values());
      return NextResponse.json(groupedClasses);
    }
  } catch (error) {
    console.error("Failed to fetch Classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
};
