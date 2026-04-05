import { Event } from "@/app/generated/prisma";
import { Card } from "@/components/ui/card";
import { fetcher } from "@/lib/fetcher";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import "react-calendar/dist/Calendar.css";
import CalendarComponent from "./Calender";
type searchParams = { [key: string]: string | string[] | undefined };

export const fetchEvents = async (selectedDate: string): Promise<Event[]> => {
  return fetcher(`/api/events?selectedDate=${selectedDate}`);
};
const CalenderComponent = async ({
  searchParams,
}: {
  searchParams: searchParams;
}) => {
  const { selectedDate } = searchParams;

  const events = await fetchEvents(
    typeof selectedDate === "string" ? selectedDate : ""
  );

  return (
    <Card className="p-4 shadow-md border-none">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold mb-2">Events Calender</h1>
          <MoreHorizontal />
        </div>
        <CalendarComponent />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold mb-2">Events</h1>
          <Link href={"#"} className="hover:underline text-sm">
            View all
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {events.length > 0 ? (
            events.map((event) => <EventsCard key={event.id} event={event} />)
          ) : (
            <p className="text-center">No Events Found!</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CalenderComponent;

const EventsCard = ({ event }: { event: Event }) => {
  return (
    <div className="p-4  rounded-lg even:bg-[hsl(var(--chart-1))]/10 odd:bg-[hsl(var(--chart-2))]/10">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{event.title}</h2>
        <span className="text-muted-foreground text-sm font-semibold">
          {new Date(event.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(event.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p className="text-muted-foreground text-sm">{event.desc}</p>
    </div>
  );
};
