"use client";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";

import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";

import { Class } from "@/lib/types";
import { searchStudent } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const fetchClasses = async (): Promise<Class[]> => {
  const response = await fetch("/api/classes");
  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }
  return response.json();
};

const SearchForm = ({
  requireSection = false,
}: {
  requireSection?: boolean;
}) => {
  const {
    data: classesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams.toString());

  const selectedClassParam = params.get("className");
  const selectedSectionParam = params.get("section");

  const searchSchema = searchStudent(requireSection);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      className: selectedClassParam || "",
      section: selectedSectionParam || "",
    },
  });

  // onsubmit function
  const onSubmit = async (values: z.infer<typeof searchSchema>) => {
    params.set("className", values.className);

    if (values.section) {
      params.set("section", values.section);
    } else {
      params.delete("section");
    }

    replace(`${pathname}?${params}`);
  };
  const selectedClass = form.watch("className");

  return (
    <div className="mb-4">
      <h1 className="text-3xl font-semibold mb-2">Select Criteria</h1>
      <div className="flex items-center gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-0 w-1/2 "
          >
            <div className="flex gap-4 items-end w-full">
              <div className="flex flex-col gap-2 w-full">
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
              </div>
              <div className="flex flex-col gap-2 w-full">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="section"
                  label="Select Section"
                  placeholder="Select Section"
                  required={requireSection}
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
              </div>

              <Button type="submit" variant={"outline"} className="rounded-md">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SearchForm;
