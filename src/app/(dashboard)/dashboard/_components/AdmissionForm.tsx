"use client";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { studentAdmission, uploadImage } from "@/lib/actions";
import { Class } from "@/lib/types";
import { newAdmissionSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type props = {
  classes: Class[];
};
const AdmissionForm = ({ classes }: props) => {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [checked, setChecked] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const form = useForm<z.infer<typeof newAdmissionSchema>>({
    resolver: zodResolver(newAdmissionSchema),
  });

  // onsubmit function
  const onSubmit = async (values: z.infer<typeof newAdmissionSchema>) => {
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
      if (!res.url) return;
      setUploading(false);
    }

    startTransition(() => {
      studentAdmission({ ...values, studentImg: url }).then((res) => {
        if (res.success) {
          toast.success(res.success);
          form.reset();
        } else {
          toast.error(res.error);
        }
      });
    });
  };

  const selectedClass = form.watch("className");
  const fatherName = form.watch("fatherName");
  const fatherPhone = form.watch("fatherPhone");
  const fileRef = form.register("studentImg");

  useEffect(() => {
    form.setValue("doa", new Date());
  }, []);

  // select parrent as gurdian
  useEffect(() => {
    if (checked) {
      form.setValue("gurdianName", fatherName);
      form.setValue("gurdianPhone", fatherPhone);
      form.setValue("relation", "father");
    } else {
      form.setValue("gurdianName", "");
      form.setValue("gurdianPhone", "");
    }
  }, [checked, fatherName, fatherPhone]);

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between overflow-auto">
        <h1 className="text-3xl">Student Admission</h1>
        <Button variant={"outline"} size={"sm"}>
          <Link href={"/dashboard/students/import"}>Import Student</Link>
        </Button>
      </div>
      <hr className="my-2" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <h1 className="text-2xl w-full bg-zinc-200 dark:bg-zinc-900 px-2 py-1 rounded-sm">
              Personal Info
            </h1>

            {/* Full Name  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="fullName"
                label="Full Name"
                placeholder="Full Name"
              />

              {/* Class Roll  */}
              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="classRoll"
                label="Class Roll"
                placeholder="Class Roll"
              />

              {/* Class  */}
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

              {/* Sections */}
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

              {/* gender */}
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

              {/* date of birth  */}
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="dob"
                label="Date Of Birth"
                placeholder="Date Of Birth"
              />

              {/* admission date  */}
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="doa"
                label="Admission Date"
                placeholder="Admission Date"
              />

              {/* Mobile  */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="mobile"
                label="Mobile"
                placeholder="0170100000"
              />

              {/* Blood group  */}
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

              {/*student photo  */}
              <CustomFormField
                fieldType={FormFieldType.FILE}
                control={form.control}
                name="studentImg"
                label="Choose Image"
                placeholder="Choose Image"
                fileRef={fileRef}
                required={false}
              />

              {/* Address info  */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="Address"
                required={false}
              />

              {/* Others info  */}
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

          {/* gurdian information */}
          <div>
            <h1 className="text-2xl w-full bg-zinc-200 dark:bg-zinc-900 px-2 py-1 rounded-sm">
              Grudian Info
            </h1>
            <div className="grid grid-cols-4 gap-2 gap-y-4 py-4">
              {/* Father Name  */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="fatherName"
                label="Father's Name"
                placeholder="Father's Name"
              />

              {/* Mother Name  */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="motherName"
                label="Mother's Name"
                placeholder="Mother's Name"
              />

              {/* Father Phone  */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="fatherPhone"
                label="Father's Phone No"
                placeholder="Father's Phone No"
              />

              {/* checkbox */}
              <div className="flex items-center gap-4">
                <Checkbox
                  id="check"
                  checked={checked}
                  onCheckedChange={() => setChecked(!checked)}
                />
                <label htmlFor="check" className="checkbox-label">
                  Select Father as Gurdian
                </label>
              </div>

              {/* Grudian Name  */}
              <CustomFormField
                disabled={checked}
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="gurdianName"
                label="Gurdian Name"
                placeholder="Gurdian Name"
              />

              {/* Gurdian Phone  */}
              <CustomFormField
                disabled={checked}
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="gurdianPhone"
                label="Gurdian Phone No"
                placeholder="Gurdian Phone No"
              />

              {/* Relation with student */}
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
              variant={"outline"}
              size={"sm"}
              className="rounded-sm"
              disabled={isPending || uploading}
            >
              {uploading
                ? "Uploading..."
                : isPending
                ? "Submiting..."
                : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdmissionForm;
