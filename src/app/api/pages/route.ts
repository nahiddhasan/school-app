// app/api/pages/route.ts
import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { pageSchema } from "@/lib/zodSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = pageSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.errors },
        { status: 400 }
      );
    }

    const { title, slug, content, parentId } = parseResult.data;
    const schoolId = session.user.schoolId;

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        parentId: parentId || null,
        schoolId,
      },
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error("Failed to create page:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
