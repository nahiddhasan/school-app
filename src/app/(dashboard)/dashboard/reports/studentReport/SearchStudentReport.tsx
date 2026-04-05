"use client";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentPdfReport } from "@/lib/handlerFn";

import { Class } from "@/lib/types";
import { searchStudentReport } from "@/lib/zodSchema";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const fetchPdfData = async (values: {
  className: string;
  section?: string;
  selectedYearId: string | null;
}) => {
  const queryParams = new URLSearchParams({
    ...(values.selectedYearId && { selectedYearId: values.selectedYearId }),
    className: values.className,
    ...(values.section && { section: values.section }),
  });

  const res = await fetch(`/api/reports/students?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }

  return res.json();
};

const SearchStudentReport = ({ classes }: { classes: Class[] }) => {
  const { selectedYearId } = useAcademicYearStore();
  const form = useForm<z.infer<typeof searchStudentReport>>({
    resolver: zodResolver(searchStudentReport),
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof searchStudentReport>) =>
      fetchPdfData({ ...values, selectedYearId }),
    onSuccess: (res) => {
      if (res.success) {
        studentPdfReport(res.students);
      } else {
        toast.error(res.error);
      }
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
    },
  });

  const onSubmit = (values: z.infer<typeof searchStudentReport>) => {
    mutation.mutate(values);
  };

  const selectedClass = form.watch("className");

  return (
    <div className="mb-4">
      <h1 className="text-3xl mb-2">Select Criteria</h1>
      <div className="flex items-center gap-4">
        {/* select search  */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 ">
            <div className="flex gap-4 items-end w-full">
              <div className="flex flex-col gap-2 w-full">
                <FormField
                  control={form.control}
                  name="className"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-md">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.className}>
                              {cls.className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <FormField
                  control={form.control}
                  name="section"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Section</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-10 rounded-md">
                            <SelectValue placeholder="Select Section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes
                            .find((item) => item.className === selectedClass)
                            ?.sectionName.map((section) => (
                              <SelectItem key={section} value={section}>
                                {section}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                variant={"secondary"}
                className="rounded-md"
              >
                Download Reoprt
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SearchStudentReport;
