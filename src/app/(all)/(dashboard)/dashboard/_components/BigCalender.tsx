"use client";
import { calendarEvents } from "@/const/data";
import moment from "moment";
import { useState } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const BigCalender = () => {
  const [view, setView] = useState<View>(Views.WEEK);

  const handleViewChange = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <div className="h-full p-4 rounded-md bg-card">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "98%" }}
        views={["week", "day"]}
        view={view}
        onView={handleViewChange}
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 17, 0, 0)}
      />
    </div>
  );
};

export default BigCalender;
