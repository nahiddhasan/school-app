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
import { fetchSampleData } from "@/lib/actions/sampleResultData.action";
import { Class } from "@/lib/types";
import { SampleResultSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SampleResultData = ({ classes }: { classes: Class[] }) => {
  const form = useForm<z.infer<typeof SampleResultSchema>>({
    resolver: zodResolver(SampleResultSchema),
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof SampleResultSchema>) =>
      fetchSampleData(values),
    onSuccess: (res) => {
      console.log(res);
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
        <FormField
          control={form.control}
          name="className"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
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

        <div className="space-x-2 flex items-end h-full">
          <Button
            type="submit"
            variant={"secondary"}
            disabled={mutation.isPending}
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
