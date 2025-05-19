"use client";

import { Class, Subject, Teacher } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";
import { createSchedule } from "@/lib/actions/createSchedule";

import { scheduleSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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

const daysOfWeek = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];
const CreateScheduleForm = () => {
  const router = useRouter();

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

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      startTime: "08:00",
      endTime: "08:45",
    },
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof scheduleSchema>) =>
      createSchedule(values),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        form.reset();
        router.push("/dashboard/schedule/class-schedules");
      } else {
        toast.error(res.error);
      }
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
    },
  });

  const onSubmit = (values: z.infer<typeof scheduleSchema>) => {
    mutation.mutate(values);
  };
  const selectedClass = form.watch("className");

  return (
    <div className="h-[calc(100%-70px)] flex items-center justify-center overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2 max-w-xl mx-auto bg-card rounded-lg p-6 shadow-md"
        >
          <h1 className="text-3xl py-4 font-bold">Create new schedule</h1>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="className"
            label="Select Class"
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
            label="Select Section"
            placeholder="Select Section"
            disabled={isLoadingClass}
          >
            {classesData
              ?.find((item) => item.id === selectedClass)
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
            label="Select Subject"
            placeholder="Select Subject"
            disabled={isLoadingSubject}
          >
            {subjectsData?.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="teacher"
            label="Select Teacher"
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
            label="Day Of Week"
            placeholder="Day Of Week"
          >
            {daysOfWeek.map((day) => (
              <SelectItem key={day.value} value={String(day.value)}>
                {day.label}
              </SelectItem>
            ))}
          </CustomFormField>

          <div className="flex items-center gap-4">
            <CustomFormField
              fieldType={FormFieldType.TIME}
              control={form.control}
              name="startTime"
              label="Start Time"
              placeholder="Start Time"
            />
            <CustomFormField
              fieldType={FormFieldType.TIME}
              control={form.control}
              name="endTime"
              label="End Time"
              placeholder="End Time"
            />
          </div>
          <Button
            variant={"secondary"}
            disabled={mutation.isPending}
            type="submit"
          >
            Save Schedule
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateScheduleForm;
