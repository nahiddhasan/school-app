// pages/api/pages/tree/route.ts (Next.js App Router)
import { auth } from "@/auth";
import { prisma } from "@/lib/connect";
import { NextResponse } from "next/server";

// recursive function to build tree
const getNestedPages = async (
  parentId: string | null = null,
  schoolId: string
): Promise<any[]> => {
  const pages = await prisma.page.findMany({
    where: { parentId, schoolId },
    orderBy: { title: "asc" },
  });

  return Promise.all(
    pages.map(async (page) => ({
      id: page.id,
      title: page.title,
      children: await getNestedPages(page.id, schoolId),
    }))
  );
};

export const GET = async () => {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    !["ADMIN", "SUPERADMIN"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const schoolId = session.user.schoolId;
  const tree = await getNestedPages(null, schoolId);
  return NextResponse.json(tree);
};
