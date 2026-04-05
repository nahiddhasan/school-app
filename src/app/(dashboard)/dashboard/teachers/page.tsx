import { Teacher } from "@/app/generated/prisma";
import TooltipComp from "@/components/ui/TooltipComp";
import { fetcher } from "@/lib/fetcher";
import { Plus } from "lucide-react";
import Link from "next/link";
import PaginationCom from "../_components/pagination/Pagination";
import SearchFilter from "../_components/SearchFilter";
import TeachersDataTable from "../_components/TeachersDataTable";

export const fetchTeachers = async (
  searchParams: searchParams
): Promise<{ teachers: Teacher[]; totalTeachers: number }> => {
  const query = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();

  const response = await fetcher(`/api/teachers/all?${query}`);
  return response;
};

type searchParams = { [key: string]: string | string[] | undefined };

const Teachers = async ({ searchParams }: { searchParams: searchParams }) => {
  const { teachers, totalTeachers } = await fetchTeachers(searchParams);

  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teachers</h1>
        <TooltipComp text="Add Teacher">
          <Link href={"/dashboard/teachers/add"}>
            <Plus
              size={32}
              className="bg-zinc-700 p-1 rounded-full cursor-pointer hover:bg-zinc-600 transition-all duration-200"
            />
          </Link>
        </TooltipComp>
      </div>

      <SearchFilter inputLabel="Search with teachers' names..." />
      <TeachersDataTable data={teachers} />
      {totalTeachers > Number(searchParams.pageSize || "10") && (
        <PaginationCom totalCount={totalTeachers} />
      )}
    </div>
  );
};

export default Teachers;
