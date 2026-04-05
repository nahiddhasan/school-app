import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const { id, title, description, iconUrl } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const highlight = await prisma.highlight.update({
      where: { id, schoolId: session.user.schoolId },
      data: {
        title,
        description,
        iconUrl,
      },
    });

    revalidatePath("/");

    return NextResponse.json(highlight);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update highlight" },
      { status: 500 }
    );
  }
}
