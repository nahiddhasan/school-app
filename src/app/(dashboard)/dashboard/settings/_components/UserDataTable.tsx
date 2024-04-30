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
import { Role } from "@prisma/client";

import { SquarePen, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
type props = {
  users: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: Role;
  }[];
};
const UserDataTable = ({ users }: props) => {
  return (
    <Table>
      <TableCaption>
        {users.length > 0 ? " List of Users" : "Nothing Found!"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Image
                src={user.image || "/img/avatar.png"}
                height={30}
                width={30}
                alt={user.name}
                className="rounded-full aspect-square object-cover"
              />
            </TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className="flex items-center gap-2">
              <TooltipComp text="Update">
                <Link href={`/`}>
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
  );
};

export default UserDataTable;
