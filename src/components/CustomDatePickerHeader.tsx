"use client";

import { getMonth, getYear } from "react-datepicker/dist/date_utils.d";

interface Props {
  changeMonth: (month: number) => void;
  changeYear: (year: number) => void;
  date: Date;
}
const CustomDatePickerHeader = ({ changeMonth, changeYear, date }: Props) => {
  const generateYears = (startYear: number): number[] => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }
    years.reverse();
    return years;
  };

  const years = generateYears(1900);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex items-center justify-center gap-2 m-1">
      {/* <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        {"<"}
      </button> */}

      <select
        value={getMonth(date)}
        className="px-2 py-1 dark:bg-zinc-800 bg-zinc-300 focus-visible:outline-none"
        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
      >
        {months.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        value={getYear(date)}
        className="px-2 py-1 dark:bg-zinc-800 bg-zinc-300 focus-visible:outline-none"
        onChange={({ target: { value } }) => changeYear(Number(value))}
      >
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {/* <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        {">"}
      </button> */}
    </div>
  );
};

export default CustomDatePickerHeader;
