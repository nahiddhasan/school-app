import { auth } from "@/auth";
import TooltipComp from "@/components/ui/TooltipComp";
import { prisma } from "@/lib/connect";
import { Plus } from "lucide-react";
import Link from "next/link";
import PagesDataTable from "../_components/PagesDataTable";

type searchParams = { [key: string]: string | string[] | undefined };

const Pages = async ({ searchParams }: { searchParams: searchParams }) => {
  const session = await auth();

  const pages = await prisma.page.findMany({
    where: {
      schoolId: session?.user.schoolId,
    },
  });

  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Pages</h1>
        {(session?.user.role === "SUPERADMIN" ||
          session?.user.role === "ADMIN") && (
          <TooltipComp text="Add Page">
            <Link href={"/dashboard/pages/add"}>
              <Plus
                size={32}
                className="bg-zinc-700 p-1 rounded-full cursor-pointer hover:bg-zinc-600 transition-all duration-200"
              />
            </Link>
          </TooltipComp>
        )}
      </div>

      <PagesDataTable data={pages} />
    </div>
  );
};

export default Pages;
