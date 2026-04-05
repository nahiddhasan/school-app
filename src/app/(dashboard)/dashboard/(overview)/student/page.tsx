import { fetcher } from "@/lib/fetcher";
import { convertToRepeatingEvents } from "@/lib/handlerFn";
import BigCalender from "../../_components/BigCalender";
import Announcements from "../_components/Announcements";
import CalenderComponent from "../_components/EventsCalender";

type searchParams = { [key: string]: string | string[] | undefined };

export const fetchSchedules = async () => {
  return fetcher(`/api/schedules`);
};

const StudentPage = async ({
  searchParams,
}: {
  searchParams: searchParams;
}) => {
  const schedules = await fetchSchedules();

  const data = convertToRepeatingEvents(schedules);

  return (
    <div className="flex gap-4 p-4 overflow-y-scroll h-[calc(100vh-48px)]">
      <div className="w-2/3">
        <BigCalender calendarEvents={data} />
      </div>
      <div className="w-1/3 flex flex-col gap-4">
        <CalenderComponent searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
