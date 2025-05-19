"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { BigCalendarEvent } from "@/lib/types";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import UpdateScheduleForm from "./UpdateScheduleForm";

const localizer = momentLocalizer(moment);

const BigCalender = ({
  calendarEvents,
}: {
  calendarEvents: BigCalendarEvent[];
}) => {
  const { data: session } = useSession();
  const [view, setView] = useState<View>(Views.WEEK);

  const [selectedEvent, setSelectedEvent] = useState<BigCalendarEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewChange = (selectedView: View) => {
    setView(selectedView);
  };

  const handleEventClick = (event: BigCalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };
  return (
    <div className="h-full p-4 rounded-md bg-card shadow-md">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "98%" }}
        views={["week", "day"]}
        view={view}
        onView={handleViewChange}
        date={currentDate} // <- controls visible date
        onNavigate={handleNavigate}
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 17, 0, 0)}
        onSelectEvent={
          session?.user.role === "ADMIN" ? handleEventClick : undefined
        }
      />
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <UpdateScheduleForm
            data={selectedEvent!}
            setIsModalOpen={setIsModalOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BigCalender;
