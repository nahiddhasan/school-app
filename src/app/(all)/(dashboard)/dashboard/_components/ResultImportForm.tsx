"use client";
import { ExamType } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { importResults } from "@/lib/actions/importResult.action";
import { Class } from "@/lib/types";
import { uploadResultSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type props = {
  classes: Class[];
};
const ResultImportForm = ({ classes }: props) => {
  const form = useForm<z.infer<typeof uploadResultSchema>>({
    resolver: zodResolver(uploadResultSchema),
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

          <FormField
            control={form.control}
            name="section"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Section <span className="text-red-500">*</span>
                </FormLabel>
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
          <FormField
            control={form.control}
            name="examType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Exam <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-10 rounded-md">
                      <SelectValue placeholder="Select Exam Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ExamType.MIDTERM}>
                      {ExamType.MIDTERM}
                    </SelectItem>
                    <SelectItem value={ExamType.FINAL}>
                      {ExamType.FINAL}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    Select CSV <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Select CSV"
                      {...fileRef}
                      className="text-sm h-10 rounded-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="space-x-2 flex items-end h-full">
            <Button
              type="submit"
              variant={"outline"}
              className="rounded-md"
              disabled={mutation.isPending}
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
