// "use client";
"use client";

import { Class } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";

import { addUser } from "@/lib/actions";
import { scheduleSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
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

const daysOfWeek = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];
const AddUser = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { data: classesData, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      startTime: "08:00",
      endTime: "08:45",
    },
  });

  const onSubmit = (values: z.infer<typeof scheduleSchema>) => {
    console.log(values);
    return;
    startTransition(() => {
      addUser(data).then((res) => {
        if (res.success) {
          toast.success(res.success);
          router.push("/dashboard/users/current-users");
        } else {
          toast.error(res.error);
        }
      });
    });
  };
  const selectedClass = form.watch("className");
  return (
    <div className="h-[calc(100%-70px)] flex items-center justify-center">
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
          >
            {classesData?.map((cls) => (
              <SelectItem key={cls.id} value={cls.className}>
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
          >
            {classesData
              ?.find((item) => item.className === selectedClass)
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
          >
            <SelectItem value={"bangla"}>Bangla</SelectItem>
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="teacher"
            label="Select Teacher"
            placeholder="Select Teacher"
          >
            <SelectItem value={"johm"}>John Doe</SelectItem>
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
          <Button variant={"secondary"} disabled={isPending} type="submit">
            Save Schedule
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddUser;
