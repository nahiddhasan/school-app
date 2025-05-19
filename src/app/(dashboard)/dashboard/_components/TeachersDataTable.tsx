import { Teacher } from "@/app/generated/prisma";
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

import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UpdateTeacherModal from "./UpdateTeacherModal";
type props = {
  data: Teacher[];
};

const TeachersDataTable = async ({ data }: props) => {
  const session = await auth();

  return (
    <div>
      <Table>
        <TableCaption>
          {data.length > 0 ? " List of Teachers" : "Nothing Found!"}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>id</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.teacherId}>
              <TableCell className="font-medium">{item.teacherId}</TableCell>
              <TableCell>
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={item.profileImg || "/img/avatar.png"}
                    fill
                    alt={item.name}
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <TooltipComp text={item.name}>{item.name}</TooltipComp>
              </TableCell>
              <TableCell className=" whitespace-nowrap">
                <TooltipComp text={item.email}>{item.email}</TooltipComp>
              </TableCell>
              <TableCell className=" whitespace-nowrap">{item.phone}</TableCell>
              <TableCell className="whitespace-nowrap">
                {item.designation}
              </TableCell>
              <TableCell>{item.department}</TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell>
                {new Date(item.joinedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{item.bloodGroup}</TableCell>
              <TableCell className="">
                <div className="flex justify-center items-center gap-2">
                  {session?.user.role === "ADMIN" && (
                    <>
                      <TooltipComp text="View">
                        <Link href={`/dashboard/teachers/${item.teacherId}`}>
                          <Eye size={16} />
                        </Link>
                      </TooltipComp>
                      <TooltipComp text="Update">
                        <UpdateTeacherModal teacher={item} />
                      </TooltipComp>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TeachersDataTable;
