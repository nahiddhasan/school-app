"use client";

import { Class } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";
import { addAnnouncement } from "@/lib/actions/addAnnouncement.action";

import { addAnnouncementSchema } from "@/lib/zodSchema";
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

const AddAnnouncement = () => {
  const router = useRouter();
  const { data: classesData, isLoading: isLoadingClass } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const form = useForm<z.infer<typeof addAnnouncementSchema>>({
    resolver: zodResolver(addAnnouncementSchema),
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof addAnnouncementSchema>) =>
      addAnnouncement(values),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        form.reset();
        router.push("/dashboard/announcements");
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

  const onSubmit = (values: z.infer<typeof addAnnouncementSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className="h-[calc(100%-70px)] flex items-center justify-center overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2 max-w-xl mx-auto bg-card rounded-lg p-6 shadow-md"
        >
          <h1 className="text-3xl py-4 font-bold">Add new Announcement</h1>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="title"
            label="Announcement Title"
            placeholder="Announcement Title"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="desc"
            label="Announcement Description"
            placeholder="Announcement Description"
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

          <Button
            variant={"secondary"}
            disabled={mutation.isPending}
            type="submit"
          >
            Add Announcement
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddAnnouncement;
