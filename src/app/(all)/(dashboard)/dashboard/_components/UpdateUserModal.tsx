"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";

import { updateUserSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Role } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateUser } from "@/lib/actions";
import { UserWithoutPass } from "@/lib/types";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";
type props = {
  user: UserWithoutPass;
};
const UpdateUserModal = ({ user }: props) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      id: user.id,
      email: user.email || undefined,
      name: user.name,
      role: user.role,
      isDisabled: user.isDisabled,
      password: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof updateUserSchema>) => {
    startTransition(() => {
      updateUser({ ...values, id: user.id }).then((res) => {
        if (res.messege) {
          toast.success(res.messege);
          setOpen(false);
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SquarePen size={16} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Update User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="Full Name"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="Email"
              required={false}
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="role"
              label="Role"
              placeholder="Select Role"
            >
              {Object.keys(Role).map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="Password"
              placeholder="Password"
            />
            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="isDisabled"
              label="Disable"
              placeholder="Disable"
            />

            <Button
              variant={"outline"}
              disabled={isPending}
              type="submit"
              className="float-right"
            >
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserModal;
