"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";

import { addTeacherSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Subject, Teacher } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { uploadImage } from "@/lib/actions";
import { updateTeacher } from "@/lib/actions/updateTeacher.action";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type props = {
  teacher: Teacher;
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const fetchSubjects = async (): Promise<Subject[]> => {
  const response = await fetch("/api/subjects");
  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }
  return response.json();
};

const UpdateTeacherModal = ({ teacher }: props) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const router = useRouter();
  const {
    data: subjects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  const form = useForm<z.infer<typeof addTeacherSchema>>({
    resolver: zodResolver(addTeacherSchema),
    defaultValues: {
      name: teacher.name,
      designation: teacher.designation || undefined,
      department: teacher.department || undefined,
      email: teacher.email,
      phone: Number(teacher.phone),
      subject: teacher.subject || undefined,
      bloodGroup: teacher.bloodGroup || undefined,
      address: teacher.address || undefined,
      dob: new Date(teacher.dob) || undefined,
      gender: teacher.gender || undefined,
      profileImg: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof addTeacherSchema>) =>
      updateTeacher(values, teacher.teacherId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.error);
      }
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit = async (values: z.infer<typeof addTeacherSchema>) => {
    let url: string | undefined;

    if (values.profileImg.length > 0) {
      setUploading(true);
      const formdata = new FormData();
      formdata.set("file", values.profileImg[0]);
      const res = await uploadImage(formdata);
      url = res.url;
      if (res.error) {
        toast.error(res.error);
      }
      if (!res.url) return;
      setUploading(false);
    }

    mutation.mutate({ ...values, profileImg: url });
  };

  const ImageFile = form.watch("profileImg");
  const fileRef = form.register("profileImg");
  const selectedImage = ImageFile && ImageFile[0];

  // 🔁 Preview cleanup
  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setPreviewUrl(undefined);
    }
  }, [selectedImage]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SquarePen size={16} className="cursor-pointer text-green-500" />
      </DialogTrigger>
      <DialogContent className="max-w-[50%] max-h-[92%] overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
          >
            <h1 className="text-3xl font-bold py-4">Update Teacher</h1>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="Full Name"
            />

            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="designation"
                label="Enter Designation"
                placeholder="Enter Designation"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="department"
                label="Enter Department"
                placeholder="Enter Department"
                required={false}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Enter Email"
                placeholder="Enter Email"
              />
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="phone"
                label="Enter Mobile Number"
                placeholder="Enter Mobile Number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="subject"
                label="Select Subject"
                placeholder="Select Subject"
              >
                {subjects?.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="bloodGroup"
                label="Select Blood Group"
                placeholder="Select Blood Group"
                required={false}
              >
                {bloodGroups.map((grp) => (
                  <SelectItem key={grp} value={grp}>
                    {grp}
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="gender"
                label="Select Gender"
                placeholder="Select Gender"
              >
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="dob"
                label="Date Of Birth"
                placeholder="Date Of Birth"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="password"
                label="Update Password"
                placeholder="Update Password"
                required={false}
              />
              <div className="flex gap-2 items-center justify-center">
                <CustomFormField
                  fieldType={FormFieldType.FILE}
                  control={form.control}
                  name="profileImg"
                  label="Choose Image"
                  placeholder="Choose Image"
                  fileRef={fileRef}
                  required={false}
                />

                <div className="relative h-full aspect-square">
                  <Image
                    src={previewUrl || teacher.profileImg || "/img/avatar.png"}
                    fill
                    alt="Teacher image preview"
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="address"
              label="Enter Address"
              placeholder="Enter Address"
            />
            <Button
              variant="secondary"
              disabled={mutation.isPending || uploading}
              type="submit"
              className="my-2"
            >
              {uploading ? "Uploading..." : "Update Teacher"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTeacherModal;
