// app/attendance/page.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const AttendanceSchema = z.object({
  date: z.string(),
  classId: z.string(),
  section: z.string(),
  subjectId: z.string(),
  students: z.array(
    z.object({
      studentId: z.number(),
      name: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
    })
  ),
});

type AttendanceFormValues = z.infer<typeof AttendanceSchema>;

const dummyStudents = [
  { studentId: 1, name: "Alice" },
  { studentId: 2, name: "Bob" },
  { studentId: 3, name: "Charlie" },
];

export default function TakeAttendancePage() {
  const { register, control, handleSubmit } = useForm<AttendanceFormValues>({
    resolver: zodResolver(AttendanceSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      classId: "",
      section: "",
      subjectId: "",
      students: dummyStudents.map((s) => ({
        ...s,
        status: "PRESENT" as const,
      })),
    },
  });

  const onSubmit = (data: AttendanceFormValues) => {
    console.log("Attendance submitted:", data);
    // Optionally send to API
    // await fetch('/api/attendance', { method: 'POST', body: JSON.stringify(data) })
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Take Attendance</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">Date</label>
            <input
              type="date"
              {...register("date")}
              className="w-full border rounded p-2"
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium">Class</label>
            <select
              {...register("classId")}
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option value="class-1">Class 1</option>
              <option value="class-2">Class 2</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block font-medium">Section</label>
            <select
              {...register("section")}
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block font-medium">Subject</label>
            <select
              {...register("subjectId")}
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mt-6 mb-2">Students</h3>
          <div className="space-y-2">
            {dummyStudents.map((student, index) => (
              <div
                key={student.studentId}
                className="flex items-center justify-between bg-input p-2 rounded"
              >
                <span>{student.name}</span>
                <Controller
                  name={`students.${index}.status`}
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="border rounded px-2 py-1">
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="LATE">Late</option>
                      <option value="EXCUSED">Excused</option>
                    </select>
                  )}
                />
                <input
                  type="hidden"
                  {...register(`students.${index}.studentId`)}
                  value={student.studentId}
                />
                <input
                  type="hidden"
                  {...register(`students.${index}.name`)}
                  value={student.name}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Attendance
        </button>
      </form>
    </div>
  );
}
