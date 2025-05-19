import { getSingleNotice } from "@/lib/data";
const NoticeSinglePage = async ({ params }: { params: { slug: string } }) => {
  const singleNotice = await getSingleNotice(params.slug);
  if (!singleNotice) {
    return (
      <div className="p-4 h-[200px] flex items-center justify-center">
        <h1 className="text-xl font-medium">Notice Not found!</h1>
      </div>
    );
  }
  return (
    <div className="p-4 flex items-center justify-center">
      <div className="w-1/2 h-[400px]">
        <h1 className="font-semibold text-xl leading-10">
          {singleNotice?.title}
        </h1>
        <embed
          className="w-full h-full"
          src={singleNotice.file}
          type="application/pdf"
        />
      </div>
    </div>
  );
};

export default NoticeSinglePage;
