"use client";
import { ExamType } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { importResults } from "@/lib/actions/importResult.action";
import { Class } from "@/lib/types";
import { uploadResultSchema } from "@/lib/zodSchema";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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

const ResultImportForm = () => {
  const { isCurrent } = useAcademicYearStore();

  const form = useForm<z.infer<typeof uploadResultSchema>>({
    resolver: zodResolver(uploadResultSchema),
  });

  const {
    data: classesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const mutation = useMutation({
    mutationFn: ({
      file,
      className,
      section,
      examType,
    }: {
      file: File;
      className: string;
      section: string;
      examType: ExamType;
    }) => importResults(file, className, section, examType),
  });

  // onsubmit function
  const onSubmit = async (values: z.infer<typeof uploadResultSchema>) => {
    const { file, className, section, examType } = values;
    if (!file?.length) return toast.error("Please select a CSV file");

    mutation.mutate(
      { file: file[0], className, section, examType },
      {
        onSuccess: (res) => {
          if (res.success) {
            res.details.errors.map((err: { student: string; error: string }) =>
              toast.error(`student id: ${err.student}, error: ${err.error}`)
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
  const fileRef = form.register("file");
  const selectedClass = form.watch("className");

  return (
    <div className="ring-1 p-4 ring-border   rounded-md">
      <h1 className="text-xl font-semibold">Upload Result Data here</h1>
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            name="examType"
            label="Select Exam Type"
            placeholder="Select Exam Type"
            disabled={isLoading}
          >
            {Object.keys(ExamType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.FILE}
            control={form.control}
            name="file"
            label="Choose CSV"
            placeholder="Choose CSV"
            fileRef={fileRef}
          />

          <div className="space-x-2 flex items-end h-full">
            <Button
              type="submit"
              variant={"secondary"}
              className="rounded-md"
              disabled={mutation.isPending || !isCurrent}
            >
              {mutation.isPending ? "Submiting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResultImportForm;
