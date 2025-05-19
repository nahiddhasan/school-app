"use client";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { fetchSampleData } from "@/lib/actions/sampleResultData.action";
import { Class } from "@/lib/types";
import { SampleResultSchema } from "@/lib/zodSchema";
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

const SampleResultData = () => {
  const { isCurrent } = useAcademicYearStore();
  const form = useForm<z.infer<typeof SampleResultSchema>>({
    resolver: zodResolver(SampleResultSchema),
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
    mutationFn: async (values: z.infer<typeof SampleResultSchema>) =>
      fetchSampleData(values),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
      } else {
        toast.error(res.error);
      }
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
    },
  });
  // onsubmit function
  const onSubmit = async (values: z.infer<typeof SampleResultSchema>) => {
    mutation.mutate(values);
  };

  const selectedClass = form.watch("className");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" grid grid-cols-4 gap-4 items-center justify-center my-4"
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

        <div className="space-x-2 flex items-end h-full">
          <Button
            type="submit"
            variant={"secondary"}
            disabled={mutation.isPending || !isCurrent}
            className="rounded-md"
          >
            {mutation.isPending ? "Downloading..." : "Download Sample Data"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SampleResultData;
