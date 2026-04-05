"use client";

import { AttendanceStatus, Class } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportAttendancePdf, exportAttendanceXlsx } from "@/lib/handlerFn";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type AttendanceRecord = {
  studentId: number;
  classRoll: number;
  fullName: string;
  attendance: {
    [date: string]: AttendanceStatus;
  };
};
type SearchParams = { [key: string]: string | string[] | undefined };

const fetchMonthlyAttendance = async (
  searchParams: SearchParams,
  year: number,
  month: number,
  className: string,
  section: string
) => {
  const params: Record<string, string> = {
    ...(searchParams as Record<string, string>),
    year: year.toString(),
    month: (month + 1).toString(),
    className,
    section,
  };
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`/api/attendance/view?${query}`);
  if (!response.ok) throw new Error("Failed to fetch attendance");
  return response.json();
};

const fetchAssignedClasses = async (): Promise<Class[]> => {
  const response = await fetch("/api/attendance/asign/classes");
  if (!response.ok) throw new Error("Failed to fetch assigned classes");
  return response.json();
};

const getDaysInMonth = (year: number, month: number): string[] => {
  const days = [];
  const totalDays = dayjs(`${year}-${month + 1}-01`).daysInMonth();
  for (let i = 1; i <= totalDays; i++) {
    days.push(dayjs(new Date(year, month, i)).format("YYYY-MM-DD"));
  }
  return days;
};

const MonthlyAttendanceView = ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const { data: classes, isLoading: classLoading } = useQuery({
    queryKey: ["assigned-classes"],
    queryFn: fetchAssignedClasses,
  });

  const pageSize = 10;

  const {
    data,
    isLoading: attendanceLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "monthly-attendance",
      className,
      section,
      year,
      month,
      searchParams,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const paramsWithPage = {
        ...searchParams,
        page: pageParam.toString(),
        pageSize: pageSize.toString(),
      };
      const res = await fetchMonthlyAttendance(
        paramsWithPage,
        year,
        month,
        className,
        section
      );
      return { ...res, page: pageParam };
    },
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalStudents / pageSize);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!className && !!section,
  });
  const days = getDaysInMonth(year, month);
  const students = data?.pages.flatMap((page) => page.attendanceList) || [];
  const totalStudents = data?.pages[0]?.totalStudents || 0;
  const totalPages = Math.ceil(totalStudents / pageSize);
  const currentPage = data?.pages.length || 1;

  const exportAttendance = async (type: "pdf" | "xlsx") => {
    if (!year || !month || !className || !section) {
      toast.error("Please select class and section to export");
      return;
    }
    if (students.length === 0) {
      return toast.error("No attendance records found for the selected month.");
    }
    const params: Record<string, string> = {
      ...(searchParams as Record<string, string>),
      year: year.toString(),
      month: (month + 1).toString(),
      className,
      section,
    };
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`/api/attendance/export?${query}`);
    if (!response.ok) {
      throw new Error("Failed to export attendance");
    }
    const data = await response.json();

    if (type === "pdf") {
      exportAttendancePdf(data, year, month);
    } else {
      exportAttendanceXlsx(data, year, month);
    }
  };

  return (
    <div className="p-4 space-y-4 h-[calc(100%-68px)] bg-card m-4 rounded-md overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">Monthly Attendance</h1>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center flex-wrap">
          <Select value={className} onValueChange={setClassName}>
            <SelectTrigger className="w-[160px] h-10 rounded-md bg-input">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes?.map(({ className, id }) => (
                <SelectItem key={id} value={className}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={section}
            onValueChange={setSection}
            disabled={!className}
          >
            <SelectTrigger className="w-[120px] h-10 rounded-md bg-input">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {classes
                ?.find((cls) => cls.className === className)
                ?.sectionName.map((sec) => (
                  <SelectItem key={sec} value={sec}>
                    {sec}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select
            value={month.toString()}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="w-[140px] h-10 rounded-md bg-input">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {dayjs().month(idx).format("MMMM")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={year.toString()}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-[140px] h-10 rounded-md bg-input">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }).map((_, idx) => {
                const y = new Date().getFullYear() - idx;
                return (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Dropdown */}

          <DropdownMenu>
            <DropdownMenuTrigger className="bg-input h-10 px-4 rounded-md">
              Export
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-input" align="end">
              <DropdownMenuLabel>Export Attendance Data</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => exportAttendance("pdf")}>
                Export as Pdf
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAttendance("xlsx")}>
                Export as XLSX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {attendanceLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader className="animate-spin" />
        </div>
      ) : !students || students.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          {className && section
            ? "No attendance records found for the selected month."
            : "Please select class and section to view attendance."}
        </div>
      ) : (
        <>
          <Card className="max-w-full overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="px-2 py-1 text-center">ID</TableHead>
                  <TableHead className="px-2 py-1 text-center">Roll</TableHead>
                  <TableHead className="px-2 py-1">Name</TableHead>
                  {days.map((date) => {
                    const isWeekend =
                      dayjs(date).day() === 5 || dayjs(date).day() === 6;
                    return (
                      <TableHead
                        key={date}
                        className={`text-center text-xs px-1 ${
                          isWeekend ? "text-red-500" : ""
                        }`}
                      >
                        <div>
                          {dayjs(date).format("D")}
                          <div
                            className={`text-[10px]  ${
                              isWeekend
                                ? "text-red-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {dayjs(date).format("dd")}
                          </div>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell className="text-center">
                      {student.studentId}
                    </TableCell>
                    <TableCell className="text-center">
                      {student.classRoll}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {student.fullName}
                    </TableCell>
                    {days.map((date) => {
                      const status = student.attendance[date];
                      const short =
                        status === "PRESENT"
                          ? "P"
                          : status === "ABSENT"
                          ? "A"
                          : status === "LATE"
                          ? "L"
                          : "-";
                      const color =
                        status === "PRESENT"
                          ? "text-green-600"
                          : status === "ABSENT"
                          ? "text-red-600"
                          : status === "LATE"
                          ? "text-yellow-600"
                          : "text-muted-foreground";

                      const isWeekend =
                        dayjs(date).day() === 5 || dayjs(date).day() === 6;

                      return (
                        <TableCell
                          key={date}
                          className={`text-center font-semibold ${color} ${
                            isWeekend ? "bg-muted/40" : ""
                          }`}
                        >
                          {short}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <div className="flex items-center justify-between gap-4 mt-4">
            <Button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Next"}
            </Button>
            <span className="font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyAttendanceView;
