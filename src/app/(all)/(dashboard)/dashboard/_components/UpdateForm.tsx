"use client";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import { uploadImage } from "@/lib/actions";
import { updateStudent } from "@/lib/actions/updateStudent.action";
import { Class, StudentType } from "@/lib/types";
import { newAdmissionSchema } from "@/lib/zodSchema";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  classes: Class[];
  student: StudentType;
};

const UpdateForm = ({ classes, student }: Props) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [checked, setChecked] = useState(false);
  const queryClient = useQueryClient();
  const { selectedYearId, isCurrent } = useAcademicYearStore();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const form = useForm<z.infer<typeof newAdmissionSchema>>({
    resolver: zodResolver(newAdmissionSchema),
    defaultValues: {
      fullName: student.fullName,
      className: student.enrollments[0].class?.className,
      classRoll: student.enrollments[0].classRoll,
      bloodGroup: student.bloodGroup || "",
      dob: new Date(student.dob),
      doa: new Date(student.doa),
      address: student.address || "",
      others: student.others || "",
      fatherName: student.fatherName,
      fatherPhone: student.fatherPhone,
      gender: student.gender,
      gurdianName: student.gurdianName,
      gurdianPhone: student.gurdianPhone,
      mobile: student.mobile,
      motherName: student.motherName,
      relation: student.relation,
      section: student.enrollments[0].section,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: {
      studentId: number;
      selectedYearId: any;
      values: any;
    }) => updateStudent(data.studentId, data.selectedYearId, data.values),
    onSuccess: (res) => {
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["student", student.studentId],
      });
      if (res.success) {
        toast.success(res.success);
        router.push(
          `/dashboard/students/view/${student.studentId}?selectedYearId=${selectedYearId}`
        );
        router.refresh();
      } else {
        toast.error(res.error);
      }
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

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

    mutation.mutate({
      studentId: student.studentId,
      selectedYearId,
      values: {
        ...values,
        studentImg: url || student.studentImg,
      },
    });
  };

  const selectedClass = form.watch("className");
  const ImageFile = form.watch("studentImg");
  const fileRef = form.register("studentImg");
  const selectedImage = ImageFile && ImageFile[0];

  return (
    <div className="p-4 m-4 h-[calc(100vh-70px)] overflow-y-auto bg-card rounded-lg">
      <div className="flex items-center justify-between overflow-auto">
        <h1 className="text-3xl">Update Student</h1>
      </div>
      <hr className="my-2" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* --- Personal Info Section --- */}
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
                placeholder="0170100000"
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

              <div className="flex gap-2 items-center justify-center">
                <CustomFormField
                  fieldType={FormFieldType.FILE}
                  control={form.control}
                  name="studentImg"
                  label="Choose Image"
                  placeholder="Choose Image"
                  fileRef={fileRef}
                  required={false}
                />
                <div className="relative h-full aspect-square">
                  <Image
                    src={
                      (selectedImage && URL.createObjectURL(selectedImage)) ||
                      student.studentImg ||
                      "/img/avatar.png"
                    }
                    fill
                    alt=""
                    className="rounded-full object-cover"
                  />
                </div>
              </div>

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

          {/* --- Guardian Info Section --- */}
          <div>
            <h1 className="text-2xl w-full bg-zinc-200 dark:bg-zinc-900 px-2 py-1 rounded-sm">
              Guardian Info
            </h1>
            <div className="grid grid-cols-4 gap-2 gap-y-4 py-4">
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
                {/* optional checkbox here */}
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
              className="rounded-md"
              disabled={mutation.isPending || uploading || !isCurrent}
            >
              {uploading
                ? "Uploading..."
                : mutation.isPending
                ? "Updating..."
                : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateForm;
