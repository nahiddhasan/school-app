"use client";

import {
  Class,
  Subject,
  Teacher,
  WeeklySchedule,
} from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";
import { deleteSchedule } from "@/lib/actions/deleteSchedule.action";
import { updateSchedule } from "@/lib/actions/updateSchedule";
import { BigCalendarEvent } from "@/lib/types";

import { scheduleSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const fetchClasses = async (): Promise<Class[]> => {
  const response = await fetch("/api/classes");
  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }
  return response.json();
};

const fetchTeahcers = async (): Promise<Teacher[]> => {
  const response = await fetch("/api/teachers");
  if (!response.ok) {
    throw new Error("Failed to fetch teachers");
  }
  return response.json();
};

const fetchSubjects = async (): Promise<Subject[]> => {
  const response = await fetch("/api/subjects");
  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }
  return response.json();
};

const fetchSchedule = async (id: string): Promise<WeeklySchedule> => {
  const response = await fetch(`/api/schedules/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }
  return response.json();
};

const daysOfWeek = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const UpdateScheduleForm = ({
  data,
  setIsModalOpen,
}: {
  data: BigCalendarEvent;
  setIsModalOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      className: "",
      section: "",
      subject: "",
      teacher: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    },
  });

  const { data: classesData, isLoading: isLoadingClass } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const { data: teachersData, isLoading: isLoadingTeacher } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeahcers,
  });

  const { data: subjectsData, isLoading: isLoadingSubject } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  const { data: scheduleData, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["schedule", data.id],
    queryFn: () => fetchSchedule(data.id),
    enabled: !!data?.id,
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof scheduleSchema>) =>
      updateSchedule(values, data.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        form.reset();
        setIsModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    },
    onError: () => toast.error("Something went wrong!"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSchedule(data.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        setIsModalOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    },
    onError: () => toast.error("Something went wrong!"),
  });

  const onSubmit = (values: z.infer<typeof scheduleSchema>) => {
    mutation.mutate(values);
  };

  const selectedClass = form.watch("className");

  useEffect(() => {
    if (scheduleData) {
      form.reset({
        className: scheduleData.classId,
        section: scheduleData.section,
        subject: scheduleData.subjectId,
        teacher: String(scheduleData.teacherId),
        dayOfWeek: String(scheduleData.dayOfWeek),
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
      });
    }
  }, [scheduleData, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 relative"
      >
        <h1 className="text-2xl font-semibold pb-2">Update Schedule</h1>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="className"
          label="Class"
          placeholder="Select Class"
          disabled={isLoadingClass}
        >
          {classesData?.map((cls) => (
            <SelectItem key={cls.id} value={cls.id}>
              {cls.className}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="section"
          label="Section"
          placeholder="Select Section"
          disabled={!selectedClass || isLoadingClass}
        >
          {classesData
            ?.find((cls) => cls.id === selectedClass)
            ?.sectionName.map((section) => (
              <SelectItem key={section} value={section}>
                {section}
              </SelectItem>
            ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="subject"
          label="Subject"
          placeholder="Select Subject"
          disabled={isLoadingSubject}
        >
          {subjectsData?.map((sub) => (
            <SelectItem key={sub.id} value={sub.id}>
              {sub.name}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="teacher"
          label="Teacher"
          placeholder="Select Teacher"
          disabled={isLoadingTeacher}
        >
          {teachersData?.map((teacher) => (
            <SelectItem
              key={teacher.teacherId}
              value={String(teacher.teacherId)}
            >
              {teacher.name}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="dayOfWeek"
          label="Day of the Week"
          placeholder="Day of Week"
          disabled
        >
          {daysOfWeek.map((day) => (
            <SelectItem key={day.value} value={String(day.value)}>
              {day.label}
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex gap-4">
          <CustomFormField
            fieldType={FormFieldType.TIME}
            control={form.control}
            name="startTime"
            label="Start Time"
            placeholder="Start Time"
            disabled
          />
          <CustomFormField
            fieldType={FormFieldType.TIME}
            control={form.control}
            name="endTime"
            label="End Time"
            placeholder="End Time"
            disabled
          />
        </div>

        <div className="flex gap-4 pt-2">
          <Button type="submit" disabled={mutation.isPending}>
            Update Schedule
          </Button>
          <Button
            type="button"
            onClick={() => deleteMutation.mutate()}
            variant="destructive"
            disabled={deleteMutation.isPending}
          >
            Delete Schedule
          </Button>
        </div>

        {isLoadingClass ||
          isLoadingTeacher ||
          isLoadingSubject ||
          (isLoadingSchedule && (
            <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          ))}
      </form>
    </Form>
  );
};

export default UpdateScheduleForm;
