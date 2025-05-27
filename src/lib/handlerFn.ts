import { AttendanceStatus, Role } from "@/app/generated/prisma";
import { routeAccessMap } from "./routes";
// import { writeFile } from "node:fs/promises";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { BigCalendarEvent, StudentType, WeeklyScheduleFull } from "./types";

export const hasAccess = (path: string, userRole: Role): boolean => {
  for (const [pattern, allowedRoles] of Object.entries(routeAccessMap)) {
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      return (allowedRoles as Role[]).includes(userRole);
    }
  }
  return true; // Default: accessible if no specific restriction
};

export const parseCSV = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error.message);
      },
    });
  });
};

//upload file
// export const uploadImage = async (file: File) => {
//   const buffer = Buffer.from(await file.arrayBuffer());
//   const filename = file.name.replaceAll(" ", "_");
//   const timestamp = new Date().getTime();
//   const fileNameWithtimestamp = timestamp + filename;
//   try {
//     const toPath = path.join(
//       process.cwd(),
//       "public/upload/" + fileNameWithtimestamp
//     );

//     await writeFile(toPath, buffer);
//     return { Message: "Success", url: `/upload/${fileNameWithtimestamp}` };
//   } catch (error) {
//     console.log("Error occured ", error);
//     return { Message: "Upload Failed" };
//   }
// };

export const marksToGrade = async (marks: number) => {
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  if (marks >= 33) return "D";
  return "F";
};

export const convertToRepeatingEvents = (
  schedules: WeeklyScheduleFull[],
  repeatWeeks: number = 10,
  baseWeekStart: Date = new Date("2025-05-04")
): BigCalendarEvent[] => {
  const events: BigCalendarEvent[] = [];

  for (const schedule of schedules) {
    const [startHour, startMinute] = schedule.startTime
      ?.split(":")
      .map(Number) || [0, 0];
    const [endHour, endMinute] = schedule.endTime?.split(":").map(Number) || [
      0, 0,
    ];

    for (let i = 0; i < repeatWeeks; i++) {
      const start = new Date(baseWeekStart);
      start.setDate(baseWeekStart.getDate() + schedule.dayOfWeek + i * 7);
      start.setHours(startHour, startMinute, 0, 0);

      const end = new Date(start);
      end.setHours(endHour, endMinute, 0, 0);

      events.push({
        id: schedule.id,
        title: `${schedule.subject?.name || "Unknown Subject"} - ${
          schedule.class?.className || "Unknown Class"
        } (${schedule.section || "Unknown Section"}) by ${
          schedule.teacher?.name || "Unknown Teacher"
        }`,
        allDay: false,
        start,
        end,
      });
    }
  }

  return events;
};

//reports
// export student data
export const studentPdfReport = (students: StudentType[]) => {
  if (!students || students.length === 0) {
    toast.error("No data found!");
    console.error("No students data provided");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape" });
  const academicYear =
    students[0]?.enrollments[0]?.academicYear?.year || "Unknown Year";
  const title = `Students Report ${academicYear}`;
  doc.text(title, 10, 10);

  const tableData = students.map((student) => [
    student.fullName || "N/A",
    student.enrollments[0]?.class?.className || "N/A",
    student.enrollments[0]?.classRoll || "N/A",
    student.enrollments[0]?.section || "N/A",
    student.fatherName || "N/A",
    student.motherName || "N/A",
    student.mobile || "N/A",
  ]);

  autoTable(doc, {
    showHead: "everyPage",
    startY: 15,
    head: [
      [
        "Name",
        "Class",
        "Roll",
        "Section",
        "Father Name",
        "Mother Name",
        "Mobile",
      ],
    ],
    body: tableData,
  });

  doc.setProperties({
    title: "Student Report",
  });

  doc.save("Student_Report.pdf");
};

// export monthly attendance
type AttendanceRecord = {
  studentId: number;
  classRoll: number;
  fullName: string;
  attendance: {
    [date: string]: AttendanceStatus;
  };
};

export const exportAttendanceXlsx = (
  students: AttendanceRecord[],
  year: number,
  month: number
) => {
  if (!students || students.length === 0) {
    console.error("No attendance data to export");
    return;
  }

  // Get all days in the month
  const totalDays = dayjs(`${year}-${month + 1}-01`).daysInMonth();
  const days = Array.from({ length: totalDays }).map((_, i) => {
    const date = dayjs(new Date(year, month, i + 1));
    return {
      key: date.format("YYYY-MM-DD"),
      label: date.format("DD ddd"), // e.g., "01 Mon"
    };
  });

  // Header row
  const header = ["ID", "Roll", "Name", ...days.map((d) => d.label)];

  // Data rows
  const data = students.map((student) => {
    return [
      student.studentId,
      student.classRoll,
      student.fullName,
      ...days.map((day) => {
        const status = student.attendance[day.key];
        return status === "PRESENT"
          ? "P"
          : status === "ABSENT"
          ? "A"
          : status === "LATE"
          ? "L"
          : "-";
      }),
    ];
  });

  // Create worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  // Export file
  const fileName = `Attendance_${year}_${String(month + 1).padStart(
    2,
    "0"
  )}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const exportAttendancePdf = (
  students: AttendanceRecord[],
  year: number,
  month: number
) => {
  if (!students || students.length === 0) {
    toast.error("No data found!");
    console.error("No students data provided");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape" });

  const monthStr = dayjs(`${year}-${month + 1}-01`).format("MMMM YYYY");
  const title = `Monthly Attendance Report - ${monthStr}`;
  doc.text(title, 10, 10);

  // Get all unique dates in the month
  const daysInMonth = dayjs(`${year}-${month + 1}-01`).daysInMonth();
  const dateHeaders: string[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs(new Date(year, month, i)).format("YYYY-MM-DD");
    dateHeaders.push(date);
  }

  // Table headers
  const head = [
    ["ID", "Roll", "Name", ...dateHeaders.map((d) => dayjs(d).format("D"))],
    ["", "", "", ...dateHeaders.map((d) => dayjs(d).format("dd"))],
  ];

  // Store column indexes for Friday and Saturday
  const weekendIndexes: number[] = [];
  dateHeaders.forEach((d, idx) => {
    const dayShort = dayjs(d).format("dd").toLowerCase();
    if (dayShort.startsWith("fr") || dayShort.startsWith("sa")) {
      // +3 because first 3 columns are ID, Roll, Name
      weekendIndexes.push(idx + 3);
    }
  });

  // Table body
  const body = students.map((student) => {
    const row = [
      student.studentId.toString(),
      student.classRoll?.toString() ?? "-",
      student.fullName,
      ...dateHeaders.map((date) => {
        const status = student.attendance[date];
        if (status === "PRESENT") return "P";
        if (status === "ABSENT") return "A";
        if (status === "LATE") return "L";
        return "-";
      }),
    ];
    return row;
  });

  autoTable(doc, {
    showHead: "everyPage",
    startY: 15,
    head,
    body,
    styles: {
      fontSize: 6,
      cellPadding: 1,
      halign: "center", // Center align all cells by default
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
    },
    bodyStyles: {
      halign: "center",
    },
    didParseCell: function (data) {
      // Highlight weekend columns (Friday/Saturday)
      if (
        data.section !== "head" &&
        data.column.index >= 3 &&
        weekendIndexes.includes(data.column.index)
      ) {
        data.cell.styles.fillColor = [236, 240, 241]; // Light gray for weekends
      }
      // Only apply to attendance columns (after the first 3 columns)
      if (data.section === "body" && data.column.index >= 3) {
        const value = data.cell.raw;
        if (value === "P") {
          data.cell.styles.textColor = [39, 174, 96]; // Green for Present
        } else if (value === "A") {
          data.cell.styles.textColor = [231, 76, 60]; // Red for Absent
        } else if (value === "L") {
          data.cell.styles.textColor = [243, 156, 18]; // Orange for Late
        } else {
          data.cell.styles.textColor = 20; // Default color
        }
      }
    },
    theme: "grid",
  });

  doc.setProperties({
    title: "Attendance Report",
  });

  doc.save(`Attendance_Report_${month + 1}_${year}.pdf`);
};
