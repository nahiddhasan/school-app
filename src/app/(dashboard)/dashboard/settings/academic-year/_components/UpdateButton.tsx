"use client";
import { AcademicYear } from "@/app/generated/prisma";
import TooltipComp from "@/components/ui/TooltipComp";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import UpdateAcademicYearModal from "./UpdateAcademicYearModal";

const UpdateButton = ({ data }: { data: AcademicYear }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <TooltipComp text="Update">
        <SquarePen
          onClick={() => setOpen(!open)}
          size={16}
          className="cursor-pointer"
        />
      </TooltipComp>
      <UpdateAcademicYearModal data={data} open={open} setOpen={setOpen} />
    </div>
  );
};

export default UpdateButton;
