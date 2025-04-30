"use client";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { importStudent } from "@/lib/actions/importStudent.action";
import { Class } from "@/lib/types";
import { importStudentSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type props = {
  classes: Class[];
};
const StudentImportForm = ({ classes }: props) => {
  const form = useForm<z.infer<typeof importStudentSchema>>({
    resolver: zodResolver(importStudentSchema),
  });

  const mutation = useMutation({
    mutationFn: ({
      file,
      className,
      section,
    }: {
      file: File;
      className: string;
      section: string;
    }) => importStudent(file, className, section),
  });

  // onsubmit function
  const onSubmit = async (values: z.infer<typeof importStudentSchema>) => {
    const { file, className, section } = values;
    if (!file?.length) return toast.error("Please select a CSV file");

    mutation.mutate(
      { file: file[0], className, section },
      {
        onSuccess: (res) => {
          if (res.success) {
            res.details.errors.map((err: { student: string; error: string }) =>
              toast.error(`student name: ${err.student}, error: ${err.error}`)
            );
            toast.success(res.success);
          } else {
            toast.error(res.message || "Import failed");
          }
        },
        onError: () => {
          toast.error("Failed to upload file");
        },
      }
    );
  };
  const selectedClass = form.watch("className");
  const fileRef = form.register("file");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-4 gap-4 items-center my-4"
      >
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="className"
          label="Select Class"
          placeholder="Select Class"
        >
          {classes.map((cls) => (
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
          {classes
            .find((item) => item.className === selectedClass)
            ?.sectionName.map((section) => (
              <SelectItem key={section} value={section}>
                {section}
              </SelectItem>
            ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.FILE}
          control={form.control}
          name="file"
          label="Select csv file"
          placeholder="Select csv file"
          fileRef={fileRef}
        />

        <div className="space-x-2 flex items-end  h-full">
          <Button
            type="submit"
            variant={"outline"}
            className="rounded-md"
            disabled={mutation.isPending}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentImportForm;
