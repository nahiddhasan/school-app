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
import { takeAttendance } from "@/lib/actions/takeAttendance.action";
import { attendanceSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader, Minus, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AttendanceFormValues = z.infer<typeof attendanceSchema>;
const pageSize = 10;

const fetchStudents = async (
  className: string,
  section: string,
  page: number,
  pageSize: number
) => {
  const response = await fetch(
    `/api/students?className=${className}&section=${section}&page=${page}&pageSize=${pageSize}`
  );
  if (!response.ok) throw new Error("Failed to fetch students");
  return response.json();
};

const checkAttendanceTaken = async (
  className: string,
  section: string,
  date: string
) => {
  const res = await fetch(
    `/api/attendance/check?className=${className}&section=${section}&date=${date}`
  );
  const data = await res.json();
  return data.taken;
};

const AttendanceForm = ({ searchParams }: { searchParams: any }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [isAllPagesLoaded, setIsAllPagesLoaded] = useState(false);

  const attendanceDate = format(new Date(), "yyyy-MM-dd");

  const attendanceDraft = `attendanceDraft-${searchParams.className}-${searchParams.section}`;
  const lastPageKey = `lastPage-${searchParams.className}-${searchParams.section}`;

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attendanceDate,
      className: searchParams?.className || "",
      section: searchParams?.section || "",
      teacherId: String(session?.user.teacherId || ""),
      students: {},
    },
  });

  const { data: alreadyTaken, isLoading: isCheckingTaken } = useQuery({
    queryKey: [
      "attendance-taken",
      searchParams.className,
      searchParams.section,
      attendanceDate,
    ],
    queryFn: () =>
      checkAttendanceTaken(
        searchParams.className,
        searchParams.section,
        attendanceDate
      ),
    enabled:
      !!searchParams.className &&
      !!searchParams.section &&
      !!session?.user.teacherId,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["students", searchParams.className, searchParams.section],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetchStudents(
          searchParams.className,
          searchParams.section,
          pageParam,
          pageSize
        );

        const prev = parseInt(localStorage.getItem(lastPageKey) || "1", 10);
        if (pageParam > prev) {
          localStorage.setItem(lastPageKey, String(pageParam));
        }

        return { ...res, page: pageParam };
      },
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil(lastPage.totalStudents / pageSize);
        return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
      },
      initialPageParam: 1,
      enabled:
        !!searchParams.className &&
        !!searchParams.section &&
        !alreadyTaken &&
        !isCheckingTaken,
    });

  useEffect(() => {
    const lastPage = parseInt(localStorage.getItem(lastPageKey) || "1", 10);

    const loadAllPages = async () => {
      for (let page = 2; page <= lastPage; page++) {
        await fetchNextPage();
      }
    };

    if (!isLoading && !isFetchingNextPage && !alreadyTaken) {
      loadAllPages();
    }
  }, [isLoading, isFetchingNextPage, fetchNextPage, lastPageKey, alreadyTaken]);

  useEffect(() => {
    const lastPage = parseInt(localStorage.getItem(lastPageKey) || "1", 10);
    if (data?.pages.length === lastPage) {
      setIsAllPagesLoaded(true);
    }
  }, [data?.pages.length, lastPageKey]);

  const students = data?.pages.flatMap((page) => page.students) || [];
  const totalStudents = data?.pages[0]?.totalStudents || 0;
  const totalPages = Math.ceil(totalStudents / pageSize);
  const currentPage = data?.pages.length || 1;

  useEffect(() => {
    if (students.length && session?.user.teacherId && isAllPagesLoaded) {
      const saved = localStorage.getItem(attendanceDraft);
      const savedStudents = saved ? JSON.parse(saved) : {};
      students.forEach((student) => {
        const statusPath = `students.${student.studentId}.status` as const;
        const notePath = `students.${student.studentId}.note` as const;
        if (savedStudents[student.studentId]) {
          form.setValue(statusPath, savedStudents[student.studentId].status);
          form.setValue(notePath, savedStudents[student.studentId].note || "");
        } else {
          form.setValue(statusPath, AttendanceStatus.PRESENT);
          form.setValue(notePath, "");
        }
      });
    }
  }, [students, session?.user.teacherId]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(attendanceDraft, JSON.stringify(value.students));
    });

    return () => subscription.unsubscribe();
  }, [form, isAllPagesLoaded]);

  const toggleCollapse = (studentId: string) => {
    setCollapsedItems((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const mutation = useMutation({
    mutationFn: async (values: AttendanceFormValues) => takeAttendance(values),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        form.reset();

        localStorage.removeItem(attendanceDraft);
        localStorage.removeItem(lastPageKey);
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

  const onSubmit = async (data: AttendanceFormValues) => {
    if (Object.keys(data.students).length < totalStudents) {
      return toast.error("Attendance for all students has not been recorded");
    }

    mutation.mutate(data);
  };

  if (isLoading || isCheckingTaken || !session?.user.teacherId) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (alreadyTaken) {
    return (
      <div className="h-[calc(100%-48px)] w-full flex flex-col items-center justify-center bg-card m-4 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          Attendance already taken for {attendanceDate}
        </h2>
        <p className="text-lg text-muted-foreground mb-6">
          You have already submitted attendance for this class and section.
        </p>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="px-6 py-2 text-lg"
            onClick={() => router.push("/dashboard/attendance")}
          >
            Go Back
          </Button>
          <Button
            variant="outline"
            className="px-6 py-2 text-lg"
            onClick={() => router.push(`/dashboard/attendance/view`)}
          >
            View Attendance
          </Button>
          <Button
            variant="outline"
            className="px-6 py-2 text-lg"
            onClick={() =>
              router.push(
                `/dashboard/attendance/update?date=${attendanceDate}&className=${searchParams.className}&section=${searchParams.section}`
              )
            }
          >
            Update Attendance
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100%-48px)] p-4 flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full space-y-4 bg-card rounded-lg p-6 shadow-md overflow-y-auto"
        >
          <h1 className="text-3xl font-bold">Take Attendance</h1>

          <input type="hidden" {...form.register("className")} />
          <input type="hidden" {...form.register("section")} />
          <input type="hidden" {...form.register("teacherId")} />

          <div className="flex items-center gap-4">
            <span className="text-2xl font-semibold">
              {searchParams?.className}
            </span>
            <span className="text-2xl font-semibold">
              Section: {searchParams?.section}
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
            {students.map((student) => {
              const isCollapsed = collapsedItems[student.studentId];
              return (
                <div
                  key={student.studentId}
                  className="space-y-2 ring-1 p-4 ring-border bg-input rounded-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center w-full">
                    <div className="flex gap-4 items-center">
                      <span className="font-semibold whitespace-nowrap">
                        {student.enrollments[0]?.classRoll}
                      </span>
                      <span className="font-semibold whitespace-nowrap min-w-[180px]">
                        {student.fullName}
                      </span>
                    </div>

                    <FormField
                      control={form.control}
                      name={`students.${student.studentId}.status`}
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
                        onClick={() => toggleCollapse(student.studentId)}
                      >
                        {isCollapsed ? <Minus size={18} /> : <Plus size={18} />}
                        Add Note
                      </button>
                    </TooltipComp>
                  </div>

                  {isCollapsed && (
                    <FormField
                      control={form.control}
                      name={`students.${student.studentId}.note`}
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

            <div className="flex items-center justify-end gap-4 mt-4">
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
          </div>

          <Button
            type="submit"
            variant="secondary"
            disabled={mutation.isPending}
            className="mt-4"
          >
            {mutation.isPending ? "Submitting..." : "Submit Attendance"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AttendanceForm;
