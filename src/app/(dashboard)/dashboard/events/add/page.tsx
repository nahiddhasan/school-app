"use client";

import { Class } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";
import { addEvent } from "@/lib/actions/addEvent.action";

import { addEventSchema } from "@/lib/zodSchema";
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

const AddEvent = () => {
  const router = useRouter();
  const { data: classesData, isLoading: isLoadingClass } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const form = useForm<z.infer<typeof addEventSchema>>({
    resolver: zodResolver(addEventSchema),
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof addEventSchema>) =>
      addEvent(values),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        form.reset();
        router.push("/dashboard/events");
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

  const onSubmit = (values: z.infer<typeof addEventSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className="h-[calc(100%-70px)] flex items-center justify-center overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2 max-w-xl mx-auto bg-card rounded-lg p-6 shadow-md"
        >
          <h1 className="text-3xl py-4 font-bold">Add new Event</h1>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="title"
            label="Event Title"
            placeholder="Event Title"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="desc"
            label="Event Description"
            placeholder="Event Description"
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="classId"
            label="Select Class"
            placeholder="Select Class"
            disabled={isLoadingClass}
            required={false}
          >
            {classesData?.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.className}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="date"
            label="Event Date"
            placeholder="Event Date"
          />
          <div className="flex items-center gap-4">
            <CustomFormField
              fieldType={FormFieldType.TIME}
              control={form.control}
              name="startTime"
              label="Event Start Time"
              placeholder="Event Start Time"
            />
            <CustomFormField
              fieldType={FormFieldType.TIME}
              control={form.control}
              name="endTime"
              label="Event End Time"
              placeholder="Event End Time"
            />
          </div>
          <Button
            variant={"secondary"}
            disabled={mutation.isPending}
            type="submit"
          >
            Add Event
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddEvent;
