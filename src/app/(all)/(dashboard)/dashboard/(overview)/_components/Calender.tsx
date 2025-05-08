"use client";
import { Card } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalenderComponent = () => {
  const [value, onChange] = useState<Value>(new Date());
  return (
    <Card className="p-4 shadow-md border-none">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold mb-2">Events Calender</h1>
          <MoreHorizontal />
        </div>
        <Calendar
          onChange={onChange}
          value={value}
          calendarType="hebrew"
          // tileClassName={({ date }) => {
          //   const day = date.getDay();
          //   if (day === 5 || day === 6) return "weekend";
          //   if (day === 0) return "sunday";
          //   return null;
          // }}
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold mb-2">Events</h1>
          <Link href={"#"} className="hover:underline text-sm">
            View all
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <EventsCard />
          <EventsCard />
          <EventsCard />
          <EventsCard />
        </div>
      </div>
    </Card>
  );
};

export default CalenderComponent;

const EventsCard = () => {
  return (
    <div className="p-4 bg-slate-200/50 dark:bg-slate-800/80 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Event Title</h2>
        <span className="text-muted-foreground text-sm font-semibold">
          11.00 AM - 02.20 PM
        </span>
      </div>
      <p className="text-muted-foreground text-sm">
        Lorem ipsum dolor sit amet,
      </p>
    </div>
  );
};
