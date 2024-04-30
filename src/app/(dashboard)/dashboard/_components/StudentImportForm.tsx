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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { importStudent } from "@/lib/actions";
import { parseCSV } from "@/lib/handlerFn";
import { Class } from "@/lib/types";
import { importStudentSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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

  // onsubmit function
  const onSubmit = async (values: z.infer<typeof importStudentSchema>) => {
    const { file, ...others } = values;
    parseCSV(file[0])
      .then((data) => {
        importStudent(data, others).then((res) => {
          if (res.success) {
            toast.success(res.success);
          } else {
            toast.error(res.error);
          }
        });
      })
      .catch((errors) => {
        toast.error("Invalid CSV data");
      });
  };
  const fileRef = form.register("file");
  const selectedClass = form.watch("className");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 grid grid-cols-4 gap-4 items-center my-4"
      >
        <FormField
          control={form.control}
          name="className"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
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
              <FormLabel>Section</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
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
          name="file"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Select CSV</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="Select CSV"
                    {...fileRef}
                    className="text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div className="space-x-2 flex items-end  h-full">
          <Button
            type="submit"
            variant={"outline"}
            size={"sm"}
            className="rounded-sm"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StudentImportForm;
