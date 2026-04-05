"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";

import { addAnnouncementSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Announcement, Class } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { updateAnnouncement } from "@/lib/actions/updateAnnouncement.action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
type props = {
  announcement: Announcement;
};
const fetchClasses = async (): Promise<Class[]> => {
  const response = await fetch("/api/classes");
  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }
  return response.json();
};

const UpdateAnnounceModal = ({ announcement }: props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: classesData, isLoading: isLoadingClass } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const form = useForm<z.infer<typeof addAnnouncementSchema>>({
    resolver: zodResolver(addAnnouncementSchema),
    defaultValues: {
      classId: announcement.classId ? announcement.classId : undefined,
      desc: announcement.desc,
      title: announcement.title,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof addAnnouncementSchema>) =>
      updateAnnouncement(values, announcement.id),
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
  const onSubmit = (values: z.infer<typeof addAnnouncementSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SquarePen size={16} className="cursor-pointer text-green-500" />
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2"
            >
              <h1 className="text-3xl py-4 font-bold">Update Announcement</h1>

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
                Update Announcement
              </Button>
            </form>
          </Form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAnnounceModal;
