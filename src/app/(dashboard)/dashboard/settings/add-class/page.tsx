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
import { addClass } from "@/lib/actions";

import { addClassSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const AddClass = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const [sections, setSections] = useState<string[]>([]);
  const [section, setSection] = useState<string>("");
  const [sectionError, setSectioinError] = useState<string>("");
  const form = useForm<z.infer<typeof addClassSchema>>({
    resolver: zodResolver(addClassSchema),
  });

  const onSubmit = (values: z.infer<typeof addClassSchema>) => {
    const data = { ...values, sectionName: sections };

    if (sections.length > 0) {
      addClass(data).then((res) => {
        if (res.messege) {
          toast.success(res.messege);
        } else {
          toast.error(res.error);
        }
      });
    } else {
      setSectioinError("Section Name Required");
      return;
    }
  };

  const handleAdd = () => {
    if (section.trim() !== "") {
      const uppsercaseSection = section.trim().toUpperCase();
      setSections([...sections, uppsercaseSection]);
      setSection("");
      inputRef.current!.focus();
    }
  };
  const handleRemoveSection = (indexToRemove: number) => {
    setSections(sections.filter((_, index) => index !== indexToRemove));
  };
  useEffect(() => {
    setSectioinError("");
  }, [sections]);
  return (
    <div className="w-full flex items-center justify-center">
      <div className="p-4 px-16 w-9/12">
        <h1 className="text-2xl py-4">Add New Class</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
          >
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ClassName</FormLabel>
                  <FormControl>
                    <Input placeholder="Class Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col">
              <div className="flex gap-2">
                <div>
                  <FormLabel>Section</FormLabel>
                  <Input
                    ref={inputRef}
                    type="text"
                    value={section}
                    placeholder="Section Name"
                    onChange={(e) => setSection(e.target.value)}
                  />
                </div>
                <Button
                  size={"sm"}
                  variant={"secondary"}
                  onClick={handleAdd}
                  type="button"
                  className="w-max self-end"
                >
                  Add
                </Button>
              </div>
              {sectionError && (
                <p className={"text-sm font-medium text-destructive py-1"}>
                  {sectionError}
                </p>
              )}
              <div className=" flex gap-2 flex-wrap mt-2">
                {sections.length > 0 &&
                  sections.map((section, i) => (
                    <span
                      key={i}
                      onClick={() => handleRemoveSection(i)}
                      className=" bg-zinc-700 rounded-md px-2 py-1 flex items-center gap-2 cursor-pointer"
                    >
                      {section}
                      <X size={14} className="text-red-600 font-bold" />
                    </span>
                  ))}
              </div>
            </div>
            <Button variant={"outline"} disabled={isPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
        {/* <form onSubmit={handleAdd} className="flex flex-col">
          <div className="flex gap-2">
            <Input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
            <Button type="submit" className="w-max">
              Add
            </Button>
          </div>
          <div className="py-3">
            {sections.length > 0 &&
              sections.map((section, i) => (
                <span key={i} className="p-2 bg-zinc-700 rounded-md mr-2">
                  {section}
                </span>
              ))}
          </div>
        </form> */}
      </div>
    </div>
  );
};

export default AddClass;
