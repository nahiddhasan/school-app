// app/[slug]/[...pagePath]/page.tsx

import { prisma } from "@/lib/connect";
import { RESERVED_PATHS } from "@/lib/routes";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
    pagePath?: string[];
  };
}

// Reserved paths that should NOT be handled by this CMS renderer

export default async function SchoolPageRenderer({ params }: Props) {
  const slugParts = params.pagePath ?? [];

  // ✅ Check if the path is a reserved route like "notice"
  if (slugParts.length > 0 && RESERVED_PATHS.includes(slugParts[0])) {
    return notFound(); // Let /[slug]/notice/[id] match instead
  }

  const joinedSlug = "/" + slugParts.join("/");

  const school = await prisma.schoolInfo.findUnique({
    where: { domainPrefix: params.slug },
  });

  if (!school) return notFound();

  const page = await prisma.page.findFirst({
    where: {
      schoolId: school.id,
      slug: joinedSlug,
    },
  });

  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 min-h-[400px]">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      {page.content ? (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <p className="text-gray-500 italic">No content available.</p>
      )}
    </div>
  );
}
