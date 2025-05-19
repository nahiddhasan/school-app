import { Role } from "@/app/generated/prisma";
import { routeAccessMap } from "./routes";
// import { writeFile } from "node:fs/promises";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { toast } from "sonner";
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
