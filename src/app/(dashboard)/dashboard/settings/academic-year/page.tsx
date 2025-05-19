import TooltipComp from "@/components/ui/TooltipComp";
import { prisma } from "@/lib/connect";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import YearDataTable from "./_components/YearDataTable";

const page = async () => {
  const academicYears = await prisma.academicYear.findMany({
    orderBy: {
      year: "desc",
    },
  });
  return (
    <div className="w-2/3 p-4">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-xl">All Years</h1>

        <TooltipComp text="Add Academic Year">
          <Link href={`/dashboard/settings/academic-year/add`}>
            <Plus
              size={32}
              className="cursor-pointer p-1 ring-1 rounded-full ring-border hover:bg-muted transition-all"
            />
          </Link>
        </TooltipComp>
      </div>
      <Suspense fallback={<span>Loading...</span>}>
        <YearDataTable data={academicYears} />
        {/* {totalStudents > Number(searchParams.pageSize || "10") && (
          <PaginationCom totalCount={totalStudents} />
        )} */}
      </Suspense>
    </div>
  );
};

export default page;
