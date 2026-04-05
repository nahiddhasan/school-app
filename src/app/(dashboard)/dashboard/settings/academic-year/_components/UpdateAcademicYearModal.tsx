"use client";

import { AcademicYear } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { updateAcademicYear } from "@/lib/actions";

import { updateAcademicYearSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type props = {
  data: AcademicYear;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const UpdateAcademicYearModal = ({ data, open, setOpen }: props) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof updateAcademicYearSchema>>({
    resolver: zodResolver(updateAcademicYearSchema),
    defaultValues: {
      id: data.id,
      year: data.year,
      isCurrent: data.current ? "true" : "false",
    },
  });

  const onSubmit = (values: z.infer<typeof updateAcademicYearSchema>) => {
    startTransition(() => {
      updateAcademicYear({ ...values, id: data.id }).then((res) => {
        if (res.success) {
          toast.success(res.success);
          setOpen(false);
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Update Academic Year</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
          >
            <CustomFormField
              fieldType={FormFieldType.NUMBER}
              control={form.control}
              name="year"
              label="Academic Year Title"
              placeholder="2025/2026"
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="isCurrent"
              label="Is Current"
              placeholder="Is Current"
              className="w-[240px]"
            >
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </CustomFormField>
            <Button variant={"outline"} disabled={isPending} type="submit">
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAcademicYearModal;
