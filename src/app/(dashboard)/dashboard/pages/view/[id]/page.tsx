import { prisma } from "@/lib/connect";

const ViewPage = async ({ params }: { params: { id: string } }) => {
  console.log(params.id);
  const pageDetails = await prisma.page.findUnique({
    where: {
      id: params.id,
    },
  });
  if (!pageDetails) {
    return null;
  }
  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Page Details</h1>
      <h4>Page Name:{pageDetails.title} </h4>
      <h4>
        Url: {process.env.NEXT_PUBLIC_BASE_URL}
        {pageDetails.slug}
      </h4>
      <div>
        <h4>Content:</h4>

        {/* Render Tiptap content */}
        <div className="prose dark:prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: pageDetails.content || "",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewPage;
