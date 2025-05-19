import { fetcher } from "@/lib/fetcher";
import { convertToRepeatingEvents } from "@/lib/handlerFn";
import BigCalender from "../../_components/BigCalender";

export const fetchSchedules = async () => {
  return fetcher(`/api/schedules`);
};

const ClassSchedule = async () => {
  const schedules = await fetchSchedules();

  const data = convertToRepeatingEvents(schedules);

  return (
    <div className="p-4 h-[calc(100%-48px)]">
      <BigCalender calendarEvents={data} />
    </div>
  );
};

export default ClassSchedule;
