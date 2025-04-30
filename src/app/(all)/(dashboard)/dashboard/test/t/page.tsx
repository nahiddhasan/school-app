"use client";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const inputs = z.object({
  exampleRequired:
    typeof window === "undefined"
      ? z.any()
      : z
          .instanceof(FileList)
          // To not allow empty files
          .refine((files) => files?.length == 1, {
            message: "File is required",
          })
          // To not allow files other than images
          .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type), {
            message: ".jpg, .jpeg, .png and .webp files are accepted.",
          }),
});
export default function Test() {
  const [image, setImage] = useState<File>();
  const [startDate, setStartDate] = useState(new Date());

  const form = useForm<z.infer<typeof inputs>>({
    resolver: zodResolver(inputs),
  });

  const onSubmit = (data: z.infer<typeof inputs>) => {
    console.log(data);
  };
  const fileRef = form.register("exampleRequired");
  console.log(image);
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 my-8 p-8"
        >
          <CustomFormField
            fieldType={FormFieldType.FILE}
            control={form.control}
            fileRef={fileRef}
            name="exampleRequired"
            label="Choose Image"
            placeholder="Choose Image"
          />
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name=""
            label="Choose date"
            placeholder="Choose Image"
          />

          <div className="w-[200px]">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="scroll"
              wrapperClassName="datePicker"
            />
          </div>

          <Button className="w-max">submit</Button>
        </form>
      </Form>
      <div>
        <form action="">
          <input
            type="file"
            onChange={(e) => setImage(e.target && e.target.files[0])}
          />
          <Image />
          <img src={image && URL.createObjectURL(image)} alt="" />
        </form>
      </div>
    </div>
  );
}
