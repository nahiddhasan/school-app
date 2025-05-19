"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
const CalendarComponent = () => {
  const [value, onChange] = useState<Value>(new Date());

  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams.toString());
  const dateString = value instanceof Date ? value.toLocaleDateString() : null;

  useEffect(() => {
    if (dateString) {
      params.set("selectedDate", dateString);
    } else {
      params.delete("selectedDate");
    }

    replace(`${pathname}?${params}`);
  }, [dateString]);

  return <Calendar onChange={onChange} value={value} calendarType="hebrew" />;
};

export default CalendarComponent;
