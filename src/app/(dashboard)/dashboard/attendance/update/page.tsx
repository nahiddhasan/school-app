"use client";

import { AttendanceStatus } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TooltipComp from "@/components/ui/TooltipComp";
import { updateAttendance } from "@/lib/actions/updateAttendance.action";
import { attendanceSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, Minus, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AttendanceFormValues = z.infer<typeof attendanceSchema>;
type SearchParams = { [key: string]: string | string[] | undefined };

const fetchAttendance = async (searchParams: SearchParams) => {
  const query = new URLSearchParams(
    searchParams as Record<string, string>
  ).toString();
  const response = await fetch(`/api/attendance/update?${query}`);
  if (!response.ok) throw new Error("Failed to fetch attendance");
  return response.json();
};

const UpdateAttendance = ({ searchParams }: { searchParams: SearchParams }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>(
    {}
  );

  const { data, isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: () => fetchAttendance(searchParams),
  });

  const toggleCollapse = (studentId: string) => {
    setCollapsedItems((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const mutation = useMutation({
    mutationFn: async (values: AttendanceFormValues) => {
      return updateAttendance(values);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        queryClient.invalidateQueries({ queryKey: ["attendance"] });
        router.push("/dashboard/attendance");
      } else {
        toast.error(res.error);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to submit attendance");
    },
  });

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      className: "",
      section: "",
      teacherId: "",
      attendanceDate: "",
      students: {},
    },
  });

  const onSubmit = (formData: AttendanceFormValues) => {
    mutation.mutate(formData);
  };

  useEffect(() => {
    if (data) {
      form.reset({
        className: data.className,
        section: data.section,
        teacherId: String(data.teacherId),
        attendanceDate: new Date(data.date).toISOString().split("T")[0],
        students: data.records.reduce((acc: any, record: any) => {
          acc[record.studentId] = {
            status: record.status ?? AttendanceStatus.ABSENT,
            note: record.note ?? "",
          };
          return acc;
        }, {}),
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100%-48px)] p-4 flex items-center justify-center ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full space-y-4 bg-card rounded-lg p-6 shadow-md overflow-y-auto"
        >
          <h1 className="text-3xl font-bold">Update Attendance</h1>

          <input type="hidden" {...form.register("className")} />
          <input type="hidden" {...form.register("section")} />
          <input type="hidden" {...form.register("teacherId")} />

          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">{data.className}</span>
            <span className="text-2xl font-semibold">
              Section: {data.section}
            </span>

            <FormField
              control={form.control}
              name="attendanceDate"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="text-2xl font-semibold">
                    Date:
                  </FormLabel>
                  <FormControl>
                    <input
                      disabled
                      type="date"
                      className="text-2xl font-semibold"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            {data.records.map((record: any) => {
              const studentId = record.studentId.toString();
              const isCollapsed = collapsedItems[studentId];

              return (
                <div
                  key={studentId}
                  className="space-y-2 ring-1 p-4 ring-border bg-input rounded-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center w-full">
                    <div className="flex gap-4 items-center">
                      <span className="font-semibold whitespace-nowrap">
                        Roll: {record.classRoll ?? "N/A"}
                      </span>
                      <span className="font-semibold whitespace-nowrap min-w-[180px]">
                        Name: {record.fullName}
                      </span>
                    </div>

                    <FormField
                      control={form.control}
                      name={`students.${studentId}.status`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex gap-6">
                              {[
                                AttendanceStatus.PRESENT,
                                AttendanceStatus.ABSENT,
                                AttendanceStatus.ONLEAVE,
                              ].map((status) => {
                                const color =
                                  status === AttendanceStatus.PRESENT
                                    ? "green"
                                    : status === AttendanceStatus.ABSENT
                                    ? "red"
                                    : "yellow";
                                return (
                                  <label
                                    key={status}
                                    className={`flex items-center gap-2 text-${color}-500 cursor-pointer`}
                                  >
                                    <Input
                                      type="radio"
                                      value={status}
                                      checked={field.value === status}
                                      onChange={() => field.onChange(status)}
                                      className={`accent-${color}-500 cursor-pointer`}
                                    />
                                    {status}
                                  </label>
                                );
                              })}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <TooltipComp text="Optional Note">
                      <button
                        type="button"
                        className="flex items-center gap-2"
                        onClick={() => toggleCollapse(studentId)}
                      >
                        {isCollapsed ? <Minus size={18} /> : <Plus size={18} />}
                        Add Note
                      </button>
                    </TooltipComp>
                  </div>

                  {isCollapsed && (
                    <FormField
                      control={form.control}
                      name={`students.${studentId}.note`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-muted-foreground">
                            Optional Note
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className="input w-full px-2 py-1 rounded-md"
                              placeholder="Enter note (if any)"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <Button
            type="submit"
            variant="secondary"
            disabled={mutation.isPending}
            className="mt-4"
          >
            {mutation.isPending ? "Updating..." : "Update Attendance"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateAttendance;
