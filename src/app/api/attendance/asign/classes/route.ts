import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { message: "You are not authenticated" },
        { status: 401 }
      );
    }
    const isAdmin = session.user.role === "ADMIN";

    if (isAdmin) {
      const classes = await prisma.class.findMany({
        orderBy: {
          createdAt: "asc",
        },
      });

      return NextResponse.json(classes);
    } else if (session.user.role === "TEACHER") {
      const assignedClass = await prisma.assignedAttendanceTeacher.findMany({
        where: {
          teacherId: Number(session.user.teacherId),
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
      { message: "Failed to fetch classes" },
      { status: 500 }
    );
  }
};
