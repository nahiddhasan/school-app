"use client";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { addAcademicYear } from "@/lib/actions";

import { addAcademicYearSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const AddAcademicYear = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof addAcademicYearSchema>>({
    resolver: zodResolver(addAcademicYearSchema),
    defaultValues: {
      isCurrent: "true",
    },
  });

  const onSubmit = (data: z.infer<typeof addAcademicYearSchema>) => {
    startTransition(() => {
      addAcademicYear(data).then((res) => {
        if (res.success) {
          toast.success(res.success);
          router.back();
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <div className="p-4 px-16">
      <h1 className="text-2xl py-4">Add New Academic Year</h1>
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
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddAcademicYear;
