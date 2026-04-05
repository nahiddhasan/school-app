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
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateProfile, uploadImage } from "@/lib/actions";
import { updateProfileSchema } from "@/lib/zodSchema";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
type props = {
  user: {
    id?: string;
    name?: string | null;
    email: string;
    image?: string | null;
    role: string;
  };
  open: boolean;
  setOpen: (open: boolean) => void;
};
const UpdateProfileModal = ({ user, open, setOpen }: props) => {
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      id: user.id,
      name: user.name!,
    },
  });

  const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
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
      updateProfile({ ...data, file: url }).then((res) => {
        if (res.messege) {
          update();
          toast.success(res.messege);
          setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Update Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2 "
          >
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
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
            />
            <div className="space-y-4">
              <h2 className=" text-muted-foreground"> Change Password </h2>
              <CustomFormField
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="currentPassword"
                label="Current Password"
                placeholder="Enter your current password"
                required={false}
              />
              <CustomFormField
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="newPassword"
                label="New Password"
                placeholder="Enter your new password"
                required={false}
              />
              <CustomFormField
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm new password"
                required={false}
              />
            </div>

            <Button variant={"outline"} disabled={isPending} type="submit">
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal;
