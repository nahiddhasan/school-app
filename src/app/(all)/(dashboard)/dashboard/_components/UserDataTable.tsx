import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Role } from "@/app/generated/prisma";
import Image from "next/image";
import DeleteAlert from "./DeleteAlert";
import UpdateUserModal from "./UpdateUserModal";
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
    <Table className="flex-1">
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
                height={28}
                width={28}
                alt={user.name}
                className="rounded-full aspect-square object-cover"
              />
            </TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell className=" space-x-2 ">
              <div className="flex items-center gap-2">
                <UpdateUserModal user={user} />
                <DeleteAlert userId={user.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserDataTable;
