"use client";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
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
        console.log(errors);
        toast.error("Invalid CSV data");
      });
  };
  const selectedClass = form.watch("className");
  const fileRef = form.register("file");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 grid grid-cols-4 gap-4 items-center my-4"
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
