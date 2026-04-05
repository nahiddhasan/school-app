import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;

    const deleted = await prisma.galleryImage.delete({
      where: { id, schoolId: session.user.schoolId },
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 }
      );
    }
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
