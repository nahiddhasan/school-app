import { auth } from "@/auth";
import TooltipComp from "@/components/ui/TooltipComp";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StudentType } from "@/lib/types";
import { Eye, SquarePen } from "lucide-react";
import Link from "next/link";
type props = {
  data: StudentType[];
  searchParams: { [key: string]: string | string[] | undefined };
};
const DataTable = async ({ data, searchParams }: props) => {
  const session = await auth();
  const { selectedYearId, isCurrent } = searchParams;
  const currentYear = isCurrent === "true";
  return (
    <div>
      <Table>
        <TableCaption>
          {data.length > 0 ? " List of Students" : "Nothing Found!"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>StudentId</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Class Roll</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.studentId}</TableCell>
              <TableCell className="font-medium">{item.fullName}</TableCell>
              <TableCell>
                {item.enrollments[0].class?.className} (
                {item.enrollments[0].section})
              </TableCell>
              <TableCell>{item.enrollments[0].classRoll}</TableCell>
              <TableCell>{item.gender}</TableCell>
              <TableCell>{item.bloodGroup}</TableCell>

              <TableCell className="flex gap-2">
                <TooltipComp text="View">
                  <Link
                    href={{
                      pathname: `/dashboard/students/view/${item.id}`,
                      query: {
                        selectedYearId,
                      },
                    }}
                  >
                    <Eye size={18} className="cursor-pointer" />
                  </Link>
                </TooltipComp>
                {currentYear && session?.user.role === "ADMIN" && (
                  <TooltipComp text="Update">
                    <Link
                      href={{
                        pathname: `/dashboard/students/edit/${item.id}`,
                        query: {
                          selectedYearId,
                          isCurrent,
                        },
                      }}
                    >
                      <SquarePen size={16} className="cursor-pointer" />
                    </Link>
                  </TooltipComp>
                )}
                {/* <TooltipComp text="Disable">
                  <Trash size={16} className="cursor-pointer" />
                </TooltipComp> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
