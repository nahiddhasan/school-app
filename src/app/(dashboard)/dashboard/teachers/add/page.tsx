"use client";

import { Subject } from "@/app/generated/prisma";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { SelectItem } from "@/components/ui/select";
import { uploadImage } from "@/lib/actions";

import { addTeacher } from "@/lib/actions/addTeacher.action";
import { addTeacherSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const fetchSubjects = async (): Promise<Subject[]> => {
  const response = await fetch("/api/subjects");
  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }
  return response.json();
};

const AddTeacher = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

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
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof addTeacherSchema>) =>
      addTeacher(values),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        form.reset();
        router.push("/dashboard/teachers");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
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

  //Preview cleanup
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
    <div className="m-4 h-[calc(100%-70px)] flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full h-full space-y-2 max-w-2xl mx-auto bg-card rounded-lg p-6 shadow-md overflow-y-auto "
        >
          <h1 className="text-3xl font-bold py-2">Add New Teacher</h1>
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
              disabled={isLoading}
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
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="address"
              label="Enter Address"
              placeholder="Enter Address"
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
                  src={previewUrl || "/img/avatar.png"}
                  fill
                  alt=""
                  className="rounded-full object-cover"
                />
              </div>
            </div>
          </div>
          <Button
            variant={"secondary"}
            disabled={mutation.isPending || uploading}
            type="submit"
          >
            {uploading ? "Uploading..." : "Add Teacher"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTeacher;
