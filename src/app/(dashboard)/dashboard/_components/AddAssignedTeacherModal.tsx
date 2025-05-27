"use client";
import { Class, Subject, Teacher } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";
import { asignTeacher } from "@/lib/actions/asignTeacher.action";

import { asignTeacherSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  const { data: classesData, isLoading: isLoadingClass } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const { data: teachersData, isLoading: isLoadingTeacher } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeahcers,
  });

  const form = useForm<z.infer<typeof asignTeacherSchema>>({
    resolver: zodResolver(asignTeacherSchema),
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof asignTeacherSchema>) =>
      asignTeacher(values),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
    },
  });

  const onSubmit = (values: z.infer<typeof asignTeacherSchema>) => {
    mutation.mutate(values);
  };
  const selectedClass = form.watch("className");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Plus
          size={32}
          className="bg-zinc-700 p-1 rounded-full cursor-pointer hover:bg-zinc-600 transition-all duration-200"
        />
      </DialogTrigger>
      <DialogContent className="w-[90%] max-w-lg md:max-w-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-2xl font-semibold">
            Assign Teacher to Class & Section
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
          >
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

            <Button
              variant={"secondary"}
              disabled={mutation.isPending}
              type="submit"
            >
              Asign Teacher
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScheduleForm;
