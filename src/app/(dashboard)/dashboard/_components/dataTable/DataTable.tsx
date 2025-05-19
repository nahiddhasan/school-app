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
import { Eye, SquarePen, Trash } from "lucide-react";
import Image from "next/image";
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
            <TableHead>Image</TableHead>
            <TableHead className="text-center">StudentId</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead className="text-center">Class Roll</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.studentId}>
              <TableCell>
                <Image
                  src={"/img/avatar.png"}
                  width={40}
                  height={40}
                  alt={item.fullName}
                />
              </TableCell>
              <TableCell className="text-center">{item.studentId}</TableCell>
              <TableCell className="font-medium">{item.fullName}</TableCell>
              <TableCell>
                {item.enrollments[0].class?.className} (
                {item.enrollments[0].section})
              </TableCell>
              <TableCell className="text-center">
                {item.enrollments[0].classRoll}
              </TableCell>
              <TableCell>{item.gender}</TableCell>
              <TableCell>{item.bloodGroup}</TableCell>

              <TableCell className="flex gap-2">
                <TooltipComp text="View">
                  <Link
                    href={{
                      pathname: `/dashboard/students/view/${item.studentId}`,
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
                        pathname: `/dashboard/students/edit/${item.studentId}`,
                        query: {
                          selectedYearId,
                          isCurrent,
                        },
                      }}
                    >
                      <SquarePen
                        size={16}
                        className="cursor-pointer text-green-500"
                      />
                    </Link>
                  </TooltipComp>
                )}
                <TooltipComp text="Disable">
                  <Trash size={16} className="cursor-pointer text-red-500" />
                </TooltipComp>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
