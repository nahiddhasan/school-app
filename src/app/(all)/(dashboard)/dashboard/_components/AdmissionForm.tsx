"use client";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { uploadImage } from "@/lib/actions";
import { studentAdmission } from "@/lib/actions/admission.action";
import { Class } from "@/lib/types";
import { newAdmissionSchema } from "@/lib/zodSchema";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  classes: Class[];
};

const AdmissionForm = ({ classes }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [checked, setChecked] = useState(false);

  const { isCurrent } = useAcademicYearStore();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const form = useForm<z.infer<typeof newAdmissionSchema>>({
    resolver: zodResolver(newAdmissionSchema),
    defaultValues: {
      doa: new Date(),
    },
  });

  const selectedClass = form.watch("className");
  const fileRef = form.register("studentImg");

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof newAdmissionSchema>) => {
      let url: string | undefined;

      if (values.studentImg.length > 0) {
        setUploading(true);
        const formdata = new FormData();
        formdata.set("file", values.studentImg[0]);
        const res = await uploadImage(formdata);
        url = res.url;
        if (res.error) {
          toast.error(res.error);
        }
        if (!res.url) throw new Error("Image upload failed");
        setUploading(false);
      }

      return studentAdmission({ ...values, studentImg: url });
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        form.reset();
        setChecked(false);
      } else {
        toast.error(res.error);
      }
    },
    onError: (error) => {
      toast.error("Something went wrong!");
      console.error(error);
    },
  });

  const onSubmit = (values: z.infer<typeof newAdmissionSchema>) => {
    mutation.mutate(values);
  };

  const handleGuardianCheck = (value: boolean) => {
    setChecked(value);
    if (value) {
      form.setValue("gurdianName", form.getValues("fatherName") || "");
      form.setValue("gurdianPhone", form.getValues("fatherPhone") || "");
      form.setValue("relation", "father");
    } else {
      form.setValue("gurdianName", "");
      form.setValue("gurdianPhone", "");
      form.setValue("relation", "");
    }
  };

  return (
    <div className="p-4 overflow-y-auto h-[calc(100vh-70px)] m-4 bg-card rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Student Admission</h1>
        <Button variant="outline" size="sm">
          <Link href="/dashboard/students/import">Import Student</Link>
        </Button>
      </div>
      <hr className="my-2" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Personal Info */}
          <div>
            <h1 className="text-2xl w-full bg-zinc-200 dark:bg-zinc-900 px-2 py-1 rounded-sm">
              Personal Info
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="fullName"
                label="Full Name"
                placeholder="Full Name"
              />
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="classRoll"
                label="Class Roll"
                placeholder="Class Roll"
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="className"
                label="Select Class"
                placeholder="Select Class"
              >
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.className}>
                    {cls.className}
                  </SelectItem>
                ))}
              </CustomFormField>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="section"
                label="Select Section"
                placeholder="Select Section"
              >
                {classes
                  .find((item) => item.className === selectedClass)
                  ?.sectionName.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
              </CustomFormField>
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
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="doa"
                label="Admission Date"
                placeholder="Admission Date"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="mobile"
                label="Mobile"
                placeholder="017xxxxxxxx"
              />
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
              <CustomFormField
                fieldType={FormFieldType.FILE}
                control={form.control}
                name="studentImg"
                label="Choose Image"
                placeholder="Choose Image"
                fileRef={fileRef}
                required={false}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="Address"
                required={false}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="others"
                label="Others Info"
                placeholder="Others Info"
                required={false}
              />
            </div>
          </div>

          {/* Guardian Info */}
          <div>
            <h1 className="text-2xl w-full bg-zinc-200 dark:bg-zinc-900 px-2 py-1 rounded-sm">
              Guardian Info
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="fatherName"
                label="Father's Name"
                placeholder="Father's Name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="motherName"
                label="Mother's Name"
                placeholder="Mother's Name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="fatherPhone"
                label="Father's Phone No"
                placeholder="Father's Phone No"
              />
              <div className="flex items-center gap-4">
                <Checkbox
                  id="check"
                  checked={checked}
                  onCheckedChange={(val) => handleGuardianCheck(Boolean(val))}
                />
                <label htmlFor="check" className="checkbox-label">
                  Select Father as Guardian
                </label>
              </div>

              <CustomFormField
                disabled={checked}
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="gurdianName"
                label="Guardian Name"
                placeholder="Guardian Name"
              />
              <CustomFormField
                disabled={checked}
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="gurdianPhone"
                label="Guardian Phone No"
                placeholder="Guardian Phone No"
              />
              <CustomFormField
                disabled={checked}
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="relation"
                label="Relation with Student"
                placeholder="Relation with Student"
              >
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </CustomFormField>
            </div>
          </div>

          <div className="space-x-2 flex items-end pb-12">
            <Button
              type="submit"
              variant={"secondary"}
              className="rounded-sm"
              disabled={mutation.isPending || uploading || !isCurrent}
            >
              {uploading
                ? "Uploading..."
                : mutation.isPending
                ? "Submitting..."
                : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdmissionForm;
