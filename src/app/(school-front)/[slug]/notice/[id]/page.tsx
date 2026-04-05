import { getSingleNotice } from "@/lib/data";
const NoticeSinglePage = async ({ params }: { params: { id: string } }) => {
  const singleNotice = await getSingleNotice(params.id);
  if (!singleNotice) {
    return (
      <div className="p-4 h-[200px] flex items-center justify-center">
        <h1 className="text-xl font-medium">Notice Not found!</h1>
      </div>
    );
  }
  return (
    <div className="p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl h-[60vh] sm:h-[70vh]">
        <h1 className="font-semibold text-xl leading-10">
          {singleNotice?.title}
        </h1>
        <embed
          className="w-full h-[calc(100%-2.5rem)] min-h-[300px]"
          src={singleNotice.file}
          type="application/pdf"
        />
      </div>
    </div>
  );
};

export default NoticeSinglePage;
