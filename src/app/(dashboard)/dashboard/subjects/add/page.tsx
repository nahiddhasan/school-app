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
    <div className="h-[calc(100%-70px)] flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2 max-w-xl mx-auto bg-card rounded-lg p-6 shadow-md"
        >
          <h1 className="text-2xl font-bold py-4">Add New Class</h1>
          <FormField
            control={form.control}
            name="className"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Name</FormLabel>
                <FormControl>
                  <Input
                    className="rounded-md h-10 bg-transparent"
                    placeholder="Subject Name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant={"secondary"} disabled={isPending} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddClass;
