"use client";
import TooltipComp from "@/components/ui/TooltipComp";
import { StudentType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAcademicYearStore } from "@/store/useAcademicYearStore";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Attendance from "./Attendance";
import ExamResult from "./ExamResult";
import Profile from "./Profile";

type props = {
  student: StudentType;
};
const RightView = ({ student }: props) => {
  const { isCurrent, selectedYearId } = useAcademicYearStore();

  const [active, setActive] = useState("Profile");
  const tabs = ["Profile", "ExamResult", "Attendance"];

  return (
    <div className="">
      <div className="z-50 px-4 rounded-md py-1 sticky top-0 left-0 dark:bg-zinc-900 bg-zinc-100 flex items-center gap-4 border-b dark:border-zinc-900 border-zinc-300 mb-3">
        {tabs.map((tab, i) => (
          <span
            key={i}
            onClick={() => setActive(tab)}
            className={cn(
              "p-2 py-1 hover:text-muted-foreground cursor-pointer",
              { "text-green-500 border-b border-green-500": active === tab }
            )}
          >
            {tab}
          </span>
        ))}
      </div>
      {isCurrent && (
        <div className="w-full flex gap-2 items-center justify-end pr-4">
          <TooltipComp text="Update">
            <Link
              href={{
                pathname: `/dashboard/students/edit/${student.studentId}`,
                query: {
                  selectedYearId,
                  isCurrent,
                },
              }}
            >
              <SquarePen size={16} className="cursor-pointer" />
            </Link>
          </TooltipComp>
        </div>
      )}
      {active === "Profile" && <Profile student={student} />}
      {active === "ExamResult" && <ExamResult student={student} />}
      {active === "Attendance" && <Attendance student={student} />}
    </div>
  );
};

export default RightView;
