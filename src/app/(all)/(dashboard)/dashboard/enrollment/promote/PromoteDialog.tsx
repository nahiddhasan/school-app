"use client";
import { Class } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { searchStudent } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const fetchClasses = async (): Promise<Class[]> => {
  const res = await fetch("/api/classes");
  if (!res.ok) throw new Error("Failed to fetch current year");
  return res.json();
};

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedDataRowIds: string[];
  disabled: boolean;
};
const PromoteDialog = ({
  open,
  setOpen,
  selectedDataRowIds,
  disabled,
}: Props) => {
  const { data: classes, isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const form = useForm<z.infer<typeof searchStudent>>({
    resolver: zodResolver(searchStudent),
  });

  // onsubmit function
  const onSubmit = async (values: z.infer<typeof searchStudent>) => {
    console.log(values);
    console.log(selectedDataRowIds);
  };
  const selectedClass = form.watch("className");

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild disabled={disabled}>
          <Button variant="destructive" size={"sm"} className="ml-auto">
            Promote selected <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="py-2">
              Promote students to next Class.
            </DialogTitle>
            <DialogDescription>
              <p>Select where you promote to your students.</p>
              <br />
              <p>
                Please note this action {`can't`} be undone. Make sure you have
                selected the correct class and section.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex gap-4 items-end w-full">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="className"
                    label="Select Next Class"
                    placeholder="Select Next Class"
                    disabled={isLoading}
                  >
                    {classes?.map((cls) => (
                      <SelectItem key={cls.id} value={cls.className}>
                        {cls.className}
                      </SelectItem>
                    ))}
                  </CustomFormField>
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="section"
                    label="Select Next Section"
                    placeholder="Select Next Section"
                  >
                    {classes
                      ?.find((item) => item.className === selectedClass)
                      ?.sectionName.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                  </CustomFormField>
                </div>
                <Button
                  variant={"destructive"}
                  type="submit"
                  size={"sm"}
                  className="rounded-md"
                >
                  Promote Now
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromoteDialog;
