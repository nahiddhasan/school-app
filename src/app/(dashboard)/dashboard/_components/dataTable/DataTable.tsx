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
import Link from "next/link";
type props = {
  data: StudentType[];
};
const DataTable = ({ data }: props) => {
  return (
    <div className="">
      <Table>
        <TableCaption>
          {data.length > 0 ? " List of Students" : "Nothing Found!"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>StudentId</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead className="">Class Roll</TableHead>
            <TableHead className="">Gender</TableHead>
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
                {item.className} ({item.section})
              </TableCell>
              <TableCell className="">{item.classRoll}</TableCell>
              <TableCell className="">{item.gender}</TableCell>
              <TableCell className="">{item.bloodGroup}</TableCell>
              <TableCell className="flex gap-2">
                <TooltipComp text="View">
                  <Link href={`/dashboard/students/view/${item.studentId}`}>
                    <Eye size={18} className="cursor-pointer" />
                  </Link>
                </TooltipComp>
                <TooltipComp text="Update">
                  <Link href={`/dashboard/students/edit/${item.studentId}`}>
                    <SquarePen size={16} className="cursor-pointer" />
                  </Link>
                </TooltipComp>
                <TooltipComp text="Disable">
                  <Trash size={16} className="cursor-pointer" />
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
