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
import { studentReport } from "@/lib/protectedDataFetch/studentReport.data";

import { Class } from "@/lib/types";
import { searchStudentReport } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
type props = {
  classes: Class[];
  type?: string;
};
const SearchStudentReport = ({ classes, data }: props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);

  const form = useForm<z.infer<typeof searchStudentReport>>({
    resolver: zodResolver(searchStudentReport),
    defaultValues: {
      className: params.get("className") || "",
      section: params.get("section") || "",
    },
  });

  // onsubmit function
  const onSubmit = async (values: z.infer<typeof searchStudentReport>) => {
    // if (values.className) {
    //   params.set("className", values.className);
    // }

    // if (values.section) {
    //   params.set("section", values.section);
    // } else {
    //   params.delete("section");
    // }

    // replace(`${pathname}?${params}`);

    // generate report onsubmit
    studentReport(values).then((data) => {
      if (data) {
        const doc = new jsPDF({ orientation: "landscape" });
        var before = "Student's Report";
        doc.text(before, 10, 10);
        let newArr: any = [];
        data.forEach((el) => {
          newArr.push([
            el.fullName,
            el.className,
            el.classRoll,
            el.section,
            el.fatherName,
            el.motherName,
            el.mobile,
          ]);
        });

        autoTable(doc, {
          showHead: "everyPage",
          startY: 15,
          head: [
            [
              "Name",
              "Class",
              "Roll",
              "Section",
              "Father Name",
              "Mother Name",
              "Mobile",
            ],
          ],
          body: newArr,
        });
        // doc.save("Report.pdf");
        doc.setProperties({
          title: "Report",
        });
        doc.output("dataurlnewwindow");
      }
    });
  };
  const selectedClass = form.watch("className");

  return (
    <div className="mb-4">
      <h1 className="text-3xl mb-2">Select Criteria</h1>
      <div className="flex items-center gap-4">
        {/* select search  */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-2/3 "
          >
            <div className="flex gap-4 items-end w-full">
              <div className="flex flex-col gap-2 w-full h-16">
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
              </div>
              <div className="flex flex-col gap-2 w-full h-16">
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
              </div>

              <Button
                type="submit"
                variant={"outline"}
                size={"sm"}
                className="rounded-sm"
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
