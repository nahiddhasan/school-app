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

import { Class } from "@/lib/types";
import { searchStudent } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SearchForm = ({ classes }: { classes: Class[] }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams.toString());
  const [searchData, setSearchData] = useState<string | number>();

  // handle Search Query
  const handleSearch = (e: any) => {
    e.preventDefault();
    params.set("page", "1");
    if (searchData) {
      params.set("search", String(searchData));
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params}`);
  };
  const selectedClassParam = params.get("className");
  const selectedSectionParam = params.get("section");

  const form = useForm<z.infer<typeof searchStudent>>({
    resolver: zodResolver(searchStudent),
    defaultValues: {
      className: selectedClassParam || "",
      section: selectedSectionParam || "",
    },
  });
  console.log(selectedClassParam);
  // onsubmit function
  const onSubmit = async (values: z.infer<typeof searchStudent>) => {
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
      <h1 className="text-3xl mb-2">Select Criteria</h1>
      <div className="flex items-center gap-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-0 w-1/2 "
          >
            <div className="flex gap-4 items-end w-full">
              <div className="flex flex-col gap-2 w-full">
                <FormField
                  control={form.control}
                  name="className"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class <span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
