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

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateClass } from "@/lib/actions";
import { addClassSchema } from "@/lib/zodSchema";
import { SquarePen, X } from "lucide-react";
import { toast } from "sonner";
type props = {
  cls: {
    id: string;
    className: string;
    sectionName: string[];
  };
};
const UpdateClassModal = ({ cls }: props) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const [sections, setSections] = useState<string[]>([]);
  const [section, setSection] = useState<string>("");
  const [sectionError, setSectioinError] = useState<string>("");
  const form = useForm<z.infer<typeof addClassSchema>>({
    resolver: zodResolver(addClassSchema),
    defaultValues: {
      className: cls.className,
    },
  });

  const onSubmit = (values: z.infer<typeof addClassSchema>) => {
    const data = { ...values, sectionName: sections, id: cls.id };

    if (sections.length > 0) {
      startTransition(() => {
        updateClass(data).then((res) => {
          if (res.messege) {
            toast.success(res.messege);
            setOpen(false);
          } else {
            toast.error(res.error);
          }
        });
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
  useEffect(() => {
    setSections(cls.sectionName);
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SquarePen size={16} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Update Class</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
};

export default UpdateClassModal;
