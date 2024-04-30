"use client";
import TooltipComp from "@/components/ui/TooltipComp";
import { StudentType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Profile from "./Profile";

type props = {
  student: StudentType;
};
const RightView = ({ student }: props) => {
  const [active, setActive] = useState("Profile");
  const tabs = ["Profile", "Exam", "Attendance"];
  return (
    <div className="">
      <div className="z-50 rounded-md py-1 sticky top-0 left-0 dark:bg-zinc-900 bg-zinc-100 flex items-center gap-4 border-b dark:border-zinc-900 border-zinc-300 mb-3">
        {tabs.map((tab, i) => (
          <span
            key={i}
            onClick={() => setActive(tab)}
            className={cn(
              "p-2 py-1 hover:text-muted-foreground cursor-pointer",
              { "text-green-500": active === tab }
            )}
          >
            {tab}
          </span>
        ))}
      </div>
      <div className="w-full flex gap-2 items-center justify-end pr-4">
        <TooltipComp text="Update">
          <Link href={`/dashboard/students/edit/${student.studentId}`}>
            <SquarePen size={16} className="cursor-pointer" />
          </Link>
        </TooltipComp>
      </div>
      {active === "Profile" && <Profile student={student} />}
    </div>
  );
};

export default RightView;
