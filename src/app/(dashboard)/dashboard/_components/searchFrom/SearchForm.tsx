"use client";
import { Button } from "@/components/ui/button";

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
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
type props = {
  classes: Class[];
};
const SearchForm = ({ classes }: props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);
  const [searchData, setSearchData] = useState<string | number>();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isLoading },
  } = useForm<z.infer<typeof searchStudent>>({
    resolver: zodResolver(searchStudent),
    defaultValues: {
      className: params.get("className") || "",
      section: params.get("section") || "",
    },
  });

  const selectedClass = watch("className");

  //  handle Class and section
  const onSubmit = async (values: z.infer<typeof searchStudent>) => {
    console.log(values);
    params.set("page", "1");
    params.set("className", values.className);

    if (values.section) {
      params.set("section", values.section);
    } else {
      params.delete("section");
    }

    replace(`${pathname}?${params}`);
  };

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
  const classRef = register("className");
  const sectionRef = register("section");
  return (
    <div className="">
      <div className="mb-4">
        <h1 className="text-3xl mb-2">Select Criteria</h1>
        <div className="flex items-center gap-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 w-1/2">
            <div className="w-full flex gap-4">
              {/* Class  */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="">
                  Class <span className="text-red-600">*</span>
                </label>
                <Select
                  {...classRef}
                  onValueChange={(value) => setValue("className", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a Class</SelectLabel>
                      {classes &&
                        classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.className}>
                            {cls.className}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {errors.className && (
                  <span className="text-red-600 text-sm">
                    {errors.className.message}
                  </span>
                )}
              </div>
              {/* Sections */}
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="">Section</label>
                <Select
                  {...sectionRef}
                  onValueChange={(value) => setValue("section", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a Section</SelectLabel>
                      {classes
                        .find((item) => item.className === selectedClass)
                        ?.sectionName.map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.section && (
                  <span className="text-red-600 text-sm">
                    {errors.section.message}
                  </span>
                )}
              </div>
              <Button
                disabled={isLoading}
                variant={"outline"}
                size={"sm"}
                className="self-end"
              >
                Search
              </Button>
            </div>
          </form>

          <form onSubmit={handleSearch} className="w-1/2 flex gap-4">
            {/* search   */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="">Search By</label>
              <input
                autoComplete="off"
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="search"
                placeholder="Search by Name or StudentId"
                name="search"
                defaultValue={params.get("search") || ""}
                onChange={(e) => setSearchData(e.target.value)}
                value={searchData}
              />
            </div>

            <Button
              type="submit"
              variant={"outline"}
              size={"sm"}
              className="self-end"
              disabled={isLoading}
            >
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
