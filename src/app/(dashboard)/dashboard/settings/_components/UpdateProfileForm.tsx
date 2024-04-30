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
import { updateUser, uploadImage } from "@/lib/actions";

import { updateUserSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
type props = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: string;
  };
};
const UpdateProfileForm = ({ user }: props) => {
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
    },
  });

  const onSubmit = async (data: z.infer<typeof updateUserSchema>) => {
    let url;
    const file = data.file[0];
    url = user.image;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadImage(formData);
      url = res.url;
    }

    startTransition(() => {
      updateUser({ ...data, file: url }).then((res) => {
        if (res.messege) {
          update();
          toast.success(res.messege);
        } else {
          toast.error(res.error);
        }
      });
    });
  };
  const fileRef = form.register("file");
  const images = form.watch("file");
  const selectedImg = images && images[0];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2 "
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="id"
                  {...field}
                  className="py-5 rounded-md"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="dark:bg-zinc-900 bg-zinc-200 rounded-xl px-4 flex justify-between items-center">
          <div className="flex gap-4 items-center py-2">
            <Image
              src={
                (selectedImg && URL.createObjectURL(selectedImg)) ||
                user.image ||
                "/img/1.jpg"
              }
              height={80}
              width={80}
              alt="profile"
              className="object-cover aspect-square rounded-full"
            />

            <div className="flex flex-col">
              <span className="text-lg font-semibold">{user.name}</span>
              <span className="text-sm">{user.role}</span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="px-4 py-2 rounded-md cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Change Photo
                  </FormLabel>
                  <FormControl className="hidden">
                    <Input
                      type="file"
                      placeholder="Select Image"
                      {...fileRef}
                      className="text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Full Name"
                  {...field}
                  className="py-5 rounded-md"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant={"outline"} disabled={isPending} type="submit">
          Update
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
