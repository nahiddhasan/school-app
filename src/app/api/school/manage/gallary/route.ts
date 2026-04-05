import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { data } = body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid data array" },
        { status: 400 }
      );
    }

    const createdImages = await Promise.all(
      data.map(async (data) => {
        if (!data.title || !data.url) return null;
        return prisma.galleryImage.create({
          data: {
            title: data.title,
            imageUrl: data.url,
            schoolId: session.user.schoolId,
          },
        });
      })
    );

    const validImages = createdImages.filter(Boolean);
    revalidatePath("/");
    return NextResponse.json(validImages, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add photo" }, { status: 500 });
  }
}
