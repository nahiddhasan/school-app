import { Event } from "@/app/generated/prisma";
import { auth } from "@/auth";
import TooltipComp from "@/components/ui/TooltipComp";
import { fetcher } from "@/lib/fetcher";
import { Plus } from "lucide-react";
import Link from "next/link";
import EventsDataTable from "../_components/EventsDataTable";
import PaginationCom from "../_components/pagination/Pagination";
import SearchFilter from "../_components/SearchFilter";

export const fetchEvents = async (
  searchParams: searchParams
): Promise<{ events: Event[]; totalEvents: number }> => {
  const query = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();

  const response = await fetcher(`/api/events/all?${query}`);
  return response;
};

type searchParams = { [key: string]: string | string[] | undefined };

const EventsPage = async ({ searchParams }: { searchParams: searchParams }) => {
  const session = await auth();
  const { events, totalEvents } = await fetchEvents(searchParams);

  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        {(session?.user.role === "ADMIN" ||
          session?.user.role === "SUPERADMIN") && (
          <TooltipComp text="Add Event">
            <Link href={"/dashboard/events/add"}>
              <Plus
                size={32}
                className="bg-zinc-300 dark:bg-zinc-700 p-1 rounded-full cursor-pointer hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-all duration-200"
              />
            </Link>
          </TooltipComp>
        )}
      </div>

      <SearchFilter inputLabel="Search with events title..." />
      <EventsDataTable data={events} />
      {totalEvents > Number(searchParams.pageSize || "10") && (
        <PaginationCom totalCount={totalEvents} />
      )}
    </div>
  );
};

export default EventsPage;
