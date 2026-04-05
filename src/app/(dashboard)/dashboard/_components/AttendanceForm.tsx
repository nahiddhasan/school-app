"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const attendanceSchema = z.object({
  sessionDate: z.string(),
  students: z.record(z.string(), z.boolean()), // studentId -> isPresent
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

// Dummy students — in a real app you'd fetch this based on classId + section
const dummyStudents = [
  { studentId: "1", name: "Alice" },
  { studentId: "2", name: "Bob" },
  { studentId: "3", name: "Charlie" },
];

export default function AttendanceForm() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      sessionDate: format(new Date(), "yyyy-MM-dd"),
      students: dummyStudents.reduce((acc, student) => {
        acc[student.studentId] = true; // default: present
        return acc;
      }, {} as Record<string, boolean>),
    },
  });

  const onSubmit = async (data: AttendanceFormValues) => {
    setSubmitting(true);
    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("Attendance submitted");
    } catch (err) {
      console.error(err);
      alert("Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Session Date */}
          <FormField
            control={form.control}
            name="sessionDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <input type="date" className="input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Student Attendance Options */}
          <div className="space-y-4">
            {dummyStudents.map((student) => (
              <FormField
                key={student.studentId}
                control={form.control}
                name={`students.${student.studentId}` as const}
                render={({ field }) => (
                  <FormItem className="flex gap-4 items-center">
                    <FormLabel className="font-normal">
                      {student.name}
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="present"
                            checked={field.value === "present"}
                            onChange={() => field.onChange("present")}
                          />
                          <span>Present</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="absent"
                            checked={field.value === "absent"}
                            onChange={() => field.onChange("absent")}
                          />
                          <span>Absent</span>
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Submit */}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Attendance"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
