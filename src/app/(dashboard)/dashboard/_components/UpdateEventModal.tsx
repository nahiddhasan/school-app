"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";

import { addEventSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Class, Event } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { updateEvent } from "@/lib/actions/updateEvent.action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type props = {
  event: Event;
};
const fetchClasses = async (): Promise<Class[]> => {
  const response = await fetch("/api/classes");
  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }
  return response.json();
};

const UpdateEventModal = ({ event }: props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: classesData, isLoading: isLoadingClass } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const form = useForm<z.infer<typeof addEventSchema>>({
    resolver: zodResolver(addEventSchema),
    defaultValues: {
      classId: event.classId ? event.classId : undefined,
      date: new Date(event.date),
      desc: event.desc,
      endTime: event.endTime
        ? new Date(event.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : undefined,
      startTime: event.startTime
        ? new Date(event.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : undefined,
      title: event.title,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof addEventSchema>) =>
      updateEvent(values, event.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const onSubmit = (values: z.infer<typeof addEventSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SquarePen size={16} className="cursor-pointer text-green-500" />
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
          >
            <h1 className="text-3xl py-4 font-bold">Update Event</h1>

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
              Update Event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEventModal;
