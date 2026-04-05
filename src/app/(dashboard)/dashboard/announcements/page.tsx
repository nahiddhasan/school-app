import { Announcement } from "@/app/generated/prisma";
import { auth } from "@/auth";
import TooltipComp from "@/components/ui/TooltipComp";
import { fetcher } from "@/lib/fetcher";
import { Plus } from "lucide-react";
import Link from "next/link";
import AnnouncementDataTable from "../_components/AnnouncementDataTable";
import SearchFilter from "../_components/SearchFilter";
import PaginationCom from "../_components/pagination/Pagination";

export const fetchAnnouncements = async (
  searchParams: searchParams
): Promise<{ announcements: Announcement[]; totalAnnouncements: number }> => {
  const query = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();

  const response = await fetcher(`/api/announcements/all?${query}`);
  return response;
};

type searchParams = { [key: string]: string | string[] | undefined };

const AnnouncementsPage = async ({
  searchParams,
}: {
  searchParams: searchParams;
}) => {
  const session = await auth();
  const { announcements, totalAnnouncements } = await fetchAnnouncements(
    searchParams
  );

  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Announcements</h1>
        {session?.user.role === "ADMIN" && (
          <TooltipComp text="Add announcement">
            <Link href={"/dashboard/announcements/add"}>
              <Plus
                size={32}
                className="bg-zinc-700 p-1 rounded-full cursor-pointer hover:bg-zinc-600 transition-all duration-200"
              />
            </Link>
          </TooltipComp>
        )}
      </div>

      <SearchFilter inputLabel="Search with announcement title..." />
      <AnnouncementDataTable data={announcements} />
      {totalAnnouncements > Number(searchParams.pageSize || "10") && (
        <PaginationCom totalCount={totalAnnouncements} />
      )}
    </div>
  );
};

export default AnnouncementsPage;
