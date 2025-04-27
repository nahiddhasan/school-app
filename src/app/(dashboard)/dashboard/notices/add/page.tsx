"use client";

import { Button } from "@/components/ui/button";
import { Dropzone } from "@/components/ui/dropzone";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { addNotice, uploadImage } from "@/lib/actions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addNoticeSchema = z.object({
  title: z.string().min(1, { message: "Notice Title is required!" }),
});

const AddNotice = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [file, setFile] = useState<File>();
  const [errorMessege, setErrorMessege] = useState("");

  const form = useForm<z.infer<typeof addNoticeSchema>>({
    resolver: zodResolver(addNoticeSchema),
  });

  const onSubmit = async (data: z.infer<typeof addNoticeSchema>) => {
    if (!file) {
      setErrorMessege("File not selected");
      return;
    }
    let url: any;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImage(formData);
      url = res.url;
    }

    startTransition(() => {
      addNotice({ ...data, file: url }).then((res) => {
        if (res.messege) {
          router.refresh();
          toast.success(res.messege);
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <div className="p-4 px-16">
      <h1 className="text-2xl py-4">Add New Notice</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notice Title</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Type your notice Title..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Dropzone onChange={setFile} className="w-full" fileExtension="pdf" />
          <div className="">
            {errorMessege && (
              <span className="text-destructive">{errorMessege}</span>
            )}
          </div>
          <Button variant={"outline"} disabled={isPending} type="submit">
            {isPending ? "Submiting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddNotice;
