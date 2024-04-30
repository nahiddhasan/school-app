"use client";
import { Button } from "@/components/ui/button";
import { updateStudent, uploadImage } from "@/lib/actions";
import { Class, StudentType } from "@/lib/types";
import { admissionSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type props = {
  classes: Class[];
  student: StudentType;
};
const UpdateForm = ({ classes, student }: props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | undefined>(
    student.studentImg || ""
  );
  const [studentImage, setStudentImage] = useState<File | null>(null);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof admissionSchema>>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      fullName: student.fullName,
      className: student.className,
      classRoll: student.classRoll,
      bloodGroup: student.bloodGroup || "",
      dob: student.dob,
      doa: student.doa,
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
      section: student.section,
      studentImg: student.studentImg,
    },
  });
  const selectedClass = watch("className");
  const fatherName = watch("fatherName");
  const fatherPhone = watch("fatherPhone");

  useEffect(() => {
    if (studentImage) {
      const handleFile = async () => {
        const formdata = new FormData();
        formdata.set("file", studentImage);
        const res = await uploadImage(formdata);
        setImgUrl(res.url);
      };
      handleFile();
    }
  }, [studentImage]);

  // generate current date
  const date = new Date();
  const futureDate = date.getDate() + 3;
  date.setDate(futureDate);
  const defaultValue = date.toLocaleDateString("en-CA");

  // onsubmit function
  const onSubmit = async (values: z.infer<typeof admissionSchema>) => {
    startTransition(() => {
      updateStudent(student.studentId, { ...values, studentImg: imgUrl }).then(
        (res) => {
          reset();
          if (res.success) {
            toast.success(res.success);
            router.push(`/dashboard/students/view/${student.studentId}`);
          } else {
            toast.error(res.error);
          }
        }
      );
    });
  };

  // select parrent as gurdian
  if (checked) {
    setValue("gurdianName", fatherName);
    setValue("gurdianPhone", fatherPhone);
  } else {
    setValue("gurdianName", student.gurdianName);
    setValue("gurdianPhone", student.gurdianPhone);
  }
  return (
    <div className="overflow-y-auto h-full p-4 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Update Student</h1>
      </div>
      <hr className="my-2" />
      <form action="" onSubmit={handleSubmit(onSubmit)} className="">
        <div>
          <h1 className="text-2xl w-full bg-zinc-200 dark:bg-zinc-900 px-2 py-1 rounded-sm">
            Personal Info
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-4 py-4">
            {/* Full Name  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="text"
                placeholder="Full Name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <span className="text-red-600 text-sm">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            {/* Class Roll  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Class Roll <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="text"
                placeholder="Class Roll"
                {...register("classRoll")}
              />
              {errors.classRoll && (
                <span className="text-red-600 text-sm">
                  {errors.classRoll.message}
                </span>
              )}
            </div>

            {/* Class  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Class <span className="text-red-600">*</span>
              </label>

              <select
                {...register("className")}
                id=""
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 dark:bg-zinc-950"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>
              {errors.className && (
                <span className="text-red-600 text-sm">
                  {errors.className.message}
                </span>
              )}
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Section <span className="text-red-600">*</span>
              </label>

              <select
                {...register("section")}
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 dark:bg-zinc-950"
              >
                <option value="">Select Section</option>

                {classes
                  .find((item) => item.className === selectedClass)
                  ?.sectionName.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
              </select>
              {errors.section && (
                <span className="text-red-600 text-sm">
                  {errors.section.message}
                </span>
              )}
            </div>

            {/* gender */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Gender <span className="text-red-600">*</span>
              </label>

              <select
                {...register("gender")}
                id=""
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 dark:bg-zinc-950"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Femele</option>
              </select>
              {errors.gender && (
                <span className="text-red-600 text-sm">
                  {errors.gender.message}
                </span>
              )}
            </div>

            {/* date of birth  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Date Of Birth <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="date"
                {...register("dob")}
              />
              {errors.dob && (
                <span className="text-red-600 text-sm">
                  {errors.dob.message}
                </span>
              )}
            </div>
            {/* admission date  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Admission Date <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="date"
                defaultValue={defaultValue}
                {...register("doa")}
              />
            </div>
            {/* Mobile  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Mobile <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent "
                type="number"
                placeholder="Mobile"
                {...register("mobile")}
              />
              {errors.mobile && (
                <span className="text-red-600 text-sm">
                  {errors.mobile.message}
                </span>
              )}
            </div>
            {/* Blood group  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">Blood Group</label>
              <select
                {...register("bloodGroup")}
                id=""
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 dark:bg-zinc-950"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>
            {/*student photo  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">Student Photo</label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="file"
                onChange={(e) =>
                  setStudentImage(e.target.files && e.target.files[0])
                }
              />
            </div>
            {/* Address info  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">Address</label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="text"
                placeholder="Address"
                {...register("address")}
              />
            </div>
            {/* Others info  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">Others Info</label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="text"
                placeholder="Others Info"
                {...register("others")}
              />
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl w-full bg-zinc-200 dark:bg-zinc-900 px-2 py-1 rounded-sm">
            Grudian Info
          </h1>
          <div className="grid grid-cols-4 gap-2 gap-y-4 py-4">
            {/* Father Name  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Father Name <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="text"
                placeholder="Father Name"
                {...register("fatherName")}
              />
              {errors.fatherName && (
                <span className="text-red-600 text-sm">
                  {errors.fatherName.message}
                </span>
              )}
            </div>
            {/* Mother Name  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Mother Name <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="text"
                placeholder="Mother Name"
                {...register("motherName")}
              />
              {errors.motherName && (
                <span className="text-red-600 text-sm">
                  {errors.motherName.message}
                </span>
              )}
            </div>

            {/* Father Phone  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Father Phone No <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="number"
                placeholder="Father Phone Number"
                {...register("fatherPhone")}
              />
              {errors.fatherPhone && (
                <span className="text-red-600 text-sm">
                  {errors.fatherPhone.message}
                </span>
              )}
            </div>
            {/* checkbox */}
            <div className="flex gap-2 items-center justify-center">
              <input
                type="checkbox"
                onChange={() => setChecked(!checked)}
                className="size-5"
              />
              <label htmlFor="">Select Father as Gurdian</label>
            </div>
            {/* Grudian Name  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Gurdian Name <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="text"
                placeholder="Gurdian Name"
                {...register("gurdianName")}
                disabled={checked}
              />
              {errors.gurdianName && (
                <span className="text-red-600 text-sm">
                  {errors.gurdianName.message}
                </span>
              )}
            </div>
            {/* Relation with student */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Relation <span className="text-red-600">*</span>
              </label>

              <select
                disabled={checked}
                {...register("relation")}
                id=""
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 dark:bg-zinc-950"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Others">Others</option>
              </select>
              {errors.relation && (
                <span className="text-red-600 text-sm">
                  {errors.relation.message}
                </span>
              )}
            </div>
            {/* Gurdian Phone  */}
            <div className="flex flex-col gap-2">
              <label htmlFor="">
                Gurdian Phone No <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full outline-none border-none ring-1 ring-zinc-400 dark:ring-zinc-800 p-1 px-2 bg-transparent"
                type="number"
                placeholder="Gurdian Phone Number"
                {...register("gurdianPhone")}
                disabled={checked}
              />
              {errors.gurdianPhone && (
                <span className="text-red-600 text-sm">
                  {errors.gurdianPhone.message}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          disabled={isPending}
          type="submit"
          variant={"outline"}
          size={"lg"}
          className="disabled:bg-zinc-700"
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdateForm;
